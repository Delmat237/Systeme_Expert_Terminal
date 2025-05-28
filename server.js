const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const prologPath = path.resolve(__dirname, 'base_connaissances.pl');

app.use(cors());
app.use(bodyParser.json());

/* ============================
   UTILITAIRES GÉNÉRAUX
============================ */
const runProlog = (goal) => {
  const cmd = `swipl -s "${prologPath}" -g "(${goal})" -t halt`;
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(stderr || 'Erreur Prolog');
      else resolve(stdout.trim());
    });
  });
};

/* ============================
   INFERENCES (Conteneurs)
============================ */
app.post('/api/infer', async (req, res) => {
  const { question, conteneurs } = req.body;
  const results = [];

  const rules = {
    isole: c => `doit_etre_isole(${c}) -> writeln(true); writeln(false)`,
    zone_reefer: c => `zone_adapte_reefer(${c}, Z) -> format('Zone: ~w~n', [Z]); writeln('false')`,
    pret_chargement: c => `pret_a_charger(${c}) -> writeln(true); writeln(false)`,
    anomalie: c => `anomalie_zone(${c}) -> writeln(true); writeln(false)`,
    zone_surchargee: c => `zone_surchargee(${c}) -> writeln(true); writeln(false)`,
    pret_embarquer: c => `pret_a_embarquer(${c}) -> writeln(true); writeln(false)`,
    attente_prolongee: c => `attente_prolongee(${c}) -> writeln(true); writeln(false)`,
    conflit_dangereux: c => `conflit_dangereux(${c}, Autre) -> format('Conflit avec: ~w~n', [Autre]); writeln('false')`
  };

  if (!rules[question]) {
    return res.status(400).json({ error: 'Requête inconnue' });
  }

  for (const conteneur of conteneurs) {
    try {
      const output = await runProlog(rules[question](conteneur));
      results.push({ conteneur, result: output });
    } catch (err) {
      results.push({ conteneur, error: String(err) });
    }
  }

  res.json({ results });
});

/* ============================
   PLANIFICATION NAVIRES
============================ */

// 1. Planification simple
app.post('/api/planification', async (req, res) => {
  const { navireId } = req.body;
  const goal = `planifier_accostage(${navireId}, Quai) -> format('Accostage prévu au quai: ~w~n', [Quai]); writeln('Aucun quai disponible')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// 2. Vérification accostage selon météo et créneau horaire
app.post('/api/accostage', async (req, res) => {
  const { navireId, heure } = req.body;
  const goal = `accostage_possible(${navireId}, ${heure}) -> writeln('Oui'); writeln('Non')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// 3. Assignation prioritaire de quai
app.post('/api/assignation', async (req, res) => {
  const { navireId, heure } = req.body;
  const goal = `assigner_quai_si_possible(${navireId}, ${heure}, Quai) -> format('Assigné au quai: ~w~n', [Quai]); writeln('Aucun quai compatible')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ============================
   GESTION CONTENEURS
============================ */

// Ajouter conteneur
app.post('/api/ajouter', async (req, res) => {
  const { id, type, nature, contenu, zone } = req.body;
  const newFact = `conteneur(${id}, ${type}, ${nature}, ${contenu}, ${zone}).`;

  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const lines = content.split('\n');

    const headerIndex = lines.findIndex(line =>
      line.trim().startsWith('% === Faits des conteneurs ===')
    );
    if (headerIndex === -1) {
      return res.status(500).json({ error: "Balise '% === Faits des conteneurs ===' introuvable" });
    }

    let insertIndex = headerIndex + 1;
    while (lines[insertIndex]?.startsWith('conteneur(')) {
      insertIndex++;
    }

    lines.splice(insertIndex, 0, newFact);
    await fs.promises.writeFile(prologPath, lines.join('\n'));

    res.json({ message: `✅ Conteneur ${id} ajouté avec succès.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout dans la base.' });
  }
});

// Supprimer conteneur
app.delete('/api/supprimer', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID requis' });

  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const updated = content
      .split('\n')
      .filter(line => !line.trim().startsWith(`conteneur(${id},`))
      .join('\n');

    await fs.promises.writeFile(prologPath, updated);
    res.json({ message: `🗑️ Conteneur ${id} supprimé.` });
  } catch (error) {
    res.status(500).json({ error: 'Erreur suppression.' });
  }
});

// Lister tous les IDs de conteneurs
app.get('/api/lister', async (_req, res) => {
  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const regex = /conteneur\(([^,\s]+)/g;
    const ids = [...content.matchAll(regex)].map(match => match[1]);
    res.json([...new Set(ids)]);
  } catch (err) {
    res.status(500).json([]);
  }
});

/* ============================
   SERVER START
============================ */
app.listen(PORT, () => console.log(`✅ API en ligne sur http://localhost:${PORT}`));

