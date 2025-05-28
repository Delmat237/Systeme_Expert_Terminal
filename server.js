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

/* =============================
   ▶ UTILITAIRE PROLOG
============================= */
const runProlog = (goal) => {
  const cmd = `swipl -s "${prologPath}" -g "(${goal})" -t halt`;
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(stderr || 'Erreur Prolog');
      else resolve(stdout.trim());
    });
  });
};

/* =============================
   ▶ INFÉRENCES CONTENEURS
============================= */
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

app.post('/api/infer', async (req, res) => {
  const { question, conteneurs } = req.body;
  if (!Array.isArray(conteneurs) || !rules[question]) {
    return res.status(400).json({ error: 'Requête invalide ou inconnue.' });
  }

  const results = await Promise.all(conteneurs.map(async conteneur => {
    try {
      const result = await runProlog(rules[question](conteneur));
      return { conteneur, result };
    } catch (err) {
      return { conteneur, error: String(err) };
    }
  }));

  res.json({ results });
});

/* =============================
   ▶ PLANIFICATION NAVIRES
============================= */

// ➤ Vérifier la faisabilité de l'accostage
app.post('/api/accostage', async (req, res) => {
  const { navireId, heure } = req.body;
  if (!navireId || heure == null) {
    return res.status(400).json({ error: 'navireId et heure requis.' });
  }

  const goal = `accostage_possible(${navireId}, ${heure}) -> writeln('Oui'); writeln('Non')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Planifier un accostage simple
app.post('/api/planification', async (req, res) => {
  const { navireId } = req.body;
  if (!navireId) return res.status(400).json({ error: 'navireId requis.' });

  const goal = `planifier_accostage(${navireId}, Quai) -> format('Accostage prévu au quai: ~w~n', [Quai]); writeln('Aucun quai disponible')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Assigner un quai prioritaire
app.post('/api/assignation', async (req, res) => {
  const { navireId, heure } = req.body;
  if (!navireId || heure == null) {
    return res.status(400).json({ error: 'navireId et heure requis.' });
  }

  const goal = `assigner_quai_si_possible(${navireId}, ${heure}, Quai) -> format('Assigné au quai: ~w~n', [Quai]); writeln('Aucun quai compatible')`;

  try {
    const result = await runProlog(goal);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ GESTION CONTENEURS
============================= */

// ➤ Ajouter un conteneur
app.post('/api/ajouter', async (req, res) => {
  const { id, type, nature, contenu, zone } = req.body;
  if (!id || !type || !nature || !contenu || !zone)
    return res.status(400).json({ error: 'Champs requis manquants.' });

  const fact = `conteneur(${id}, ${type}, ${nature}, ${contenu}, ${zone}).`;

  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const lines = content.split('\n');

    const headerIndex = lines.findIndex(l => l.includes('% --- CONTENEURS ---'));
    if (headerIndex === -1) return res.status(500).json({ error: 'Section introuvable.' });

    let insertIndex = headerIndex + 1;
    while (lines[insertIndex]?.startsWith('conteneur(')) insertIndex++;

    lines.splice(insertIndex, 0, fact);
    await fs.promises.writeFile(prologPath, lines.join('\n'));

    res.json({ message: `✅ Conteneur ${id} ajouté.` });
  } catch {
    res.status(500).json({ error: 'Erreur lors de l’ajout.' });
  }
});

// ➤ Supprimer un conteneur
app.delete('/api/supprimer', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID requis' });

  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const updated = content.split('\n').filter(line => !line.trim().startsWith(`conteneur(${id},`)).join('\n');
    await fs.promises.writeFile(prologPath, updated);

    res.json({ message: `🗑️ Conteneur ${id} supprimé.` });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// ➤ Lister les conteneurs
app.get('/api/lister', async (_req, res) => {
  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const ids = [...content.matchAll(/conteneur\(([^,\s]+)/g)].map(m => m[1]);
    res.json([...new Set(ids)]);
  } catch {
    res.status(500).json([]);
  }
});

/* =============================
   ▶ GESTION NAVIRES
============================= */

// ➤ Ajouter un navire
app.post('/api/navires', async (req, res) => {
  const { id, statut, type, longueur, priorite, capacite, tirant } = req.body;
  if (!id || !statut || !type || !longueur || !capacite || !tirant || !priorite) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  const fact = `navire(${id}, ${statut}, ${type}, ${longueur}, ${priorite}, ${capacite}, ${tirant}).`;

  try {
    const content = await fs.promises.readFile(prologPath, 'utf-8');
    const lines = content.split('\n');

    const headerIndex = lines.findIndex(line => line.includes('% priorité = oui | non'));
    if (headerIndex === -1) return res.status(500).json({ error: 'Section des navires introuvable' });

    let insertIndex = headerIndex + 2;
    while (lines[insertIndex]?.startsWith('navire(')) insertIndex++;

    lines.splice(insertIndex, 0, fact);
    await fs.promises.writeFile(prologPath, lines.join('\n'));

    res.json({ message: `✅ Navire ${id} enregistré.` });
  } catch {
    res.status(500).json({ error: 'Erreur lors de l’ajout du navire.' });
  }
});

/* =============================
   ▶ LANCEMENT SERVEUR
============================= */
app.listen(PORT, () => {
  console.log(`✅ Serveur API actif sur http://localhost:${PORT}`);
});

