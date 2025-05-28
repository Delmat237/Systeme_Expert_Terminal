// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json());

app.post('/api/infer', async (req, res) => {
  const { question, conteneurs } = req.body;
  const results = [];
  const prologPath = path.resolve(__dirname, 'base_connaissances.pl');

  for (const conteneur of conteneurs) {
    let cmd = '';

    switch (question) {
      case 'isole':
        cmd = `swipl -s "${prologPath}" -g "(doit_etre_isole(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'zone_reefer':
        cmd = `swipl -s "${prologPath}" -g "(zone_adapte_reefer(${conteneur}, Z) -> format('Zone: ~w~n', [Z]); writeln('false'))" -t halt`;
        break;
      case 'pret_chargement':
        cmd = `swipl -s "${prologPath}" -g "(pret_a_charger(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'anomalie':
        cmd = `swipl -s "${prologPath}" -g "(anomalie_zone(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'zone_surchargee':
        cmd = `swipl -s "${prologPath}" -g "(zone_surchargee(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'pret_embarquer':
        cmd = `swipl -s "${prologPath}" -g "(pret_a_embarquer(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'attente_prolongee':
        cmd = `swipl -s "${prologPath}" -g "(attente_prolongee(${conteneur}) -> writeln(true); writeln(false))" -t halt`;
        break;
      case 'conflit_dangereux':
        cmd = `swipl -s "${prologPath}" -g "(conflit_dangereux(${conteneur}, Autre) -> format('Conflit avec: ~w~n', [Autre]); writeln('false'))" -t halt`;
        break;
      default:
        return res.status(400).json({ error: 'Requête inconnue' });
    }

    try {
      const output = await new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) reject(stderr || 'Erreur d’exécution');
          else resolve(stdout.trim());
        });
      });
      results.push({ conteneur, result: output });
    } catch (error) {
      results.push({ conteneur, error: error.toString() });
    }
  }

  res.json({ results });
});


// Ajout d’un conteneur Prolog avec placement intelligent dans la section dédiée
app.post('/api/ajouter', async (req, res) => {
  const { id, type, nature, contenu, zone } = req.body;
  const newFact = `conteneur(${id}, ${type}, ${nature}, ${contenu}, ${zone}).`;

  const filePath = path.resolve(__dirname, 'base_connaissances.pl');
  try {
    const originalContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = originalContent.split('\n');

    const headerIndex = lines.findIndex(line =>
      line.trim().startsWith('% === Faits des conteneurs ===')
    );

    if (headerIndex === -1) {
      return res.status(500).json({
        error: "Balise '% === Faits des conteneurs ===' introuvable dans base_connaissances.pl"
      });
    }

    // Trouver où s’arrêtent les faits conteneur(...)
    let insertIndex = headerIndex + 1;
    while (insertIndex < lines.length && lines[insertIndex].startsWith('conteneur(')) {
      insertIndex++;
    }

    // Insertion du fait
    lines.splice(insertIndex, 0, newFact);
    const updatedContent = lines.join('\n');

    await fs.promises.writeFile(filePath, updatedContent);

    res.json({ message: `✅ Conteneur ${id} ajouté avec succès.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout dans la base.' });
  }
});

// Suppression d’un conteneur spécifique de la base Prolog
app.delete('/api/supprimer', async (req, res) => {
  const { id } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: '❌ ID de conteneur invalide.' });
  }

  const filePath = path.resolve(__dirname, 'base_connaissances.pl');

  try {
    const originalContent = await fs.promises.readFile(filePath, 'utf-8');
    const lines = originalContent.split('\n');

    const initialLength = lines.length;

    // Supprimer la ligne qui contient conteneur(cXXX, ...)
    const updatedLines = lines.filter(
      line => !line.trim().startsWith(`conteneur(${id},`)
    );

    const deleted = initialLength !== updatedLines.length;

    if (!deleted) {
      return res.status(404).json({ error: `🔍 Aucun conteneur trouvé avec l’ID : ${id}` });
    }

    await fs.promises.writeFile(filePath, updatedLines.join('\n'));

    res.json({ message: `🗑️ Conteneur ${id} supprimé avec succès.` });
  } catch (error) {
    console.error('Erreur suppression :', error);
    res.status(500).json({ error: '💥 Erreur lors de la suppression.' });
  }
});

// Lister tous les identifiants de conteneurs déclarés dans base_connaissances.pl
app.get('/api/lister', async (req, res) => {
  const filePath = path.resolve(__dirname, 'base_connaissances.pl');

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');

    // Extraire les ID depuis conteneur(ID, ...
    const regex = /conteneur\(([^,\s]+)/g;
    const ids = [...content.matchAll(regex)].map(match => match[1]);

    const uniqueIds = [...new Set(ids)];

    res.json(uniqueIds);
  } catch (error) {
    console.error('Erreur lecture fichier :', error);
    res.status(500).json([]);
  }
});



app.listen(PORT, () => console.log(`API en ligne sur http://localhost:${PORT}`));
