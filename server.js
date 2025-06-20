const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Chemins vers les différents modules Prolog
const module1Path = path.resolve(__dirname, 'module1.pl');
const module2Path = path.resolve(__dirname, 'module2.pl');
const module3Path = path.resolve(__dirname, 'module3.pl');
const module5Path = path.resolve(__dirname, 'module5.pl');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

/* =============================
   ▶ UTILITAIRE PROLOG
============================= */
const runProlog = (modulePath, goal) => {
  const cmd = `swipl -s "${modulePath}" -g "(${goal})" -t halt`;
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 10000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('Erreur Prolog:', stderr);
        reject(stderr || 'Erreur Prolog');
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

/* =============================
   ▶ MODULE 1 - BASE DE CONNAISSANCES
============================= */

// ➤ Inférences sur les conteneurs
const containerRules = {
  isole: c => `doit_etre_isole(${c}) -> writeln('true'); writeln('false')`,
  zone_reefer: c => `zone_adapte_reefer(${c}, Z) -> format('Zone: ~w~n', [Z]); writeln('false')`,
  pret_chargement: c => `pret_a_charger(${c}) -> writeln('true'); writeln('false')`,
  anomalie: c => `anomalie_zone(${c}) -> writeln('true'); writeln('false')`,
  zone_surchargee: c => `zone_surchargee(${c}) -> writeln('true'); writeln('false')`,
  pret_embarquer: c => `pret_a_embarquer(${c}) -> writeln('true'); writeln('false')`,
  attente_prolongee: c => `attente_prolongee(${c}) -> writeln('true'); writeln('false')`,
  conflit_dangereux: c => `conflit_dangereux(${c}, Autre) -> format('Conflit avec: ~w~n', [Autre]); writeln('false')`
};

app.post('/api/infer/conteneurs', async (req, res) => {
  const { question, conteneurs } = req.body;
  if (!Array.isArray(conteneurs) || !containerRules[question]) {
    return res.status(400).json({ error: 'Requête invalide ou inconnue.' });
  }

  try {
    const results = await Promise.all(conteneurs.map(async conteneur => {
      try {
        const result = await runProlog(module1Path, containerRules[question](conteneur));
        return { conteneur, result, success: true };
      } catch (err) {
        return { conteneur, error: String(err), success: false };
      }
    }));

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ PLANIFICATION NAVIRES
============================= */
// ➤ Vérifier la faisabilité de l'accostage
app.post('/api/navires/accostage', async (req, res) => {
  const { navireId, heure } = req.body;
  if (!navireId || heure == null) {
    return res.status(400).json({ error: 'navireId et heure requis.' });
  }

  const goal = `accostage_possible(${navireId}, ${heure}) -> writeln('Possible'); writeln('Impossible')`;

  try {
    const result = await runProlog(module1Path, goal);
    res.json({ navireId, heure, result, possible: result.includes('Possible') });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Planifier un accostage simple
app.post('/api/navires/planification', async (req, res) => {
  const { navireId } = req.body;
  if (!navireId) return res.status(400).json({ error: 'navireId requis.' });

  const goal = `planifier_accostage(${navireId}, Quai) -> format('Quai: ~w~n', [Quai]); writeln('Aucun')`;

  try {
    const result = await runProlog(module1Path, goal);
    const quai = result.includes('Quai:') ? result.split('Quai: ')[1] : null;
    res.json({ navireId, quai, result, success: !!quai });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Assigner un quai prioritaire
app.post('/api/navires/assignation', async (req, res) => {
  const { navireId, heure } = req.body;
  if (!navireId || heure == null) {
    return res.status(400).json({ error: 'navireId et heure requis.' });
  }

  const goal = `assigner_quai_si_possible(${navireId}, ${heure}, Quai) -> format('Assigné: ~w~n', [Quai]); writeln('Impossible')`;

  try {
    const result = await runProlog(module1Path, goal);
    const assigned = result.includes('Assigné:');
    const quai = assigned ? result.split('Assigné: ')[1] : null;
    res.json({ navireId, heure, quai, result, success: assigned });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Vérification de compatibilité quai
app.post('/api/navires/compatibilite', async (req, res) => {
  const { navireId, quaiId } = req.body;
  if (!navireId || !quaiId) {
    return res.status(400).json({ error: 'navireId et quaiId requis.' });
  }

  const goal = `quai_approprie(${navireId}, ${quaiId}) -> writeln('Compatible'); writeln('Incompatible')`;

  try {
    const result = await runProlog(module1Path, goal);
    res.json({ navireId, quaiId, result, compatible: result.includes('Compatible') });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ MODULE 2 - DÉCHARGEMENT
============================= */

app.post('/api/dechargement/trier', async (req, res) => {
  const { conteneurs } = req.body;
  if (!Array.isArray(conteneurs)) {
    return res.status(400).json({ error: 'Liste de conteneurs requise.' });
  }

  // Construction de la liste Prolog
  const listProlog = '[' + conteneurs.map(c => 
    `conteneur(${c.id}, ${c.baie}, ${c.lateral}, ${c.tier}, ${c.poids}, ${c.destination})`
  ).join(', ') + ']';

  const goal = `trier_conteneurs(${listProlog}, ListeTriee), writeln(ListeTriee)`;

  try {
    const result = await runProlog(module2Path, goal);
    res.json({ 
      conteneurs_initiaux: conteneurs,
      ordre_dechargement: result,
      success: true 
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/dechargement/exemple', async (req, res) => {
  try {
    const result = await runProlog(module2Path, 'exemple');
    res.json({ result, success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ MODULE 3 - GESTION COUR
============================= */

// ➤ Assignation de véhicules
app.post('/api/cour/assigner-vehicule', async (req, res) => {
  const { conteneurId, vehiculeId } = req.body;
  if (!conteneurId) {
    return res.status(400).json({ error: 'conteneurId requis.' });
  }

  const goal = vehiculeId 
    ? `assigner_vehicule(${conteneurId}, ${vehiculeId}) -> writeln('Assigné'); writeln('Impossible')`
    : `assigner_vehicule(${conteneurId}, V) -> format('Véhicule assigné: ~w~n', [V]); writeln('Aucun véhicule disponible')`;

  try {
    const result = await runProlog(module3Path, goal);
    res.json({ conteneurId, vehiculeId, result, success: !result.includes('Impossible') });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Assignation de zones
app.post('/api/cour/assigner-zone', async (req, res) => {
  const { conteneurId } = req.body;
  if (!conteneurId) {
    return res.status(400).json({ error: 'conteneurId requis.' });
  }

  const goal = `assigner_zone(${conteneurId}, Zone) -> format('Zone assignée: ~w~n', [Zone]); writeln('Aucune zone disponible')`;

  try {
    const result = await runProlog(module3Path, goal);
    const zone = result.includes('Zone assignée:') ? result.split('Zone assignée: ')[1] : null;
    res.json({ conteneurId, zone, result, success: !!zone });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Gestion des reefers
app.post('/api/cour/gerer-reefer', async (req, res) => {
  const { conteneurId } = req.body;
  if (!conteneurId) {
    return res.status(400).json({ error: 'conteneurId requis.' });
  }

  const goal = `gerer_reefer(${conteneurId}) -> writeln('Reefer géré'); writeln('Erreur gestion reefer')`;

  try {
    const result = await runProlog(module3Path, goal);
    res.json({ conteneurId, result, success: result.includes('géré') });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Choix de grue
app.post('/api/cour/choisir-grue', async (req, res) => {
  const { conteneurId } = req.body;
  if (!conteneurId) {
    return res.status(400).json({ error: 'conteneurId requis.' });
  }

  const goal = `choisir_grue(${conteneurId}, Grue) -> format('Grue choisie: ~w~n', [Grue]); writeln('Aucune grue disponible')`;

  try {
    const result = await runProlog(module3Path, goal);
    const grue = result.includes('Grue choisie:') ? result.split('Grue choisie: ')[1] : null;
    res.json({ conteneurId, grue, result, success: !!grue });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ État du système
app.get('/api/cour/etat', async (req, res) => {
  try {
    const result = await runProlog(module3Path, 'afficher_etat');
    res.json({ result, success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ MODULE 5 - CHARGEMENT
============================= */

// ➤ Affectation des conteneurs aux navires
app.get('/api/chargement/affecter', async (req, res) => {
  try {
    const result = await runProlog(module5Path, 'affecter_conteneurs(Affectations), writeln(Affectations)');
    res.json({ affectations: result, success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Chargement de tous les navires
app.post('/api/chargement/charger-tous', async (req, res) => {
  try {
    const result = await runProlog(module5Path, 'charger_tous_les_navires');
    res.json({ result, success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ➤ Vérification d'un conteneur
app.post('/api/chargement/verifier', async (req, res) => {
  const { conteneurId } = req.body;
  if (!conteneurId) {
    return res.status(400).json({ error: 'conteneurId requis.' });
  }

  const goal = `verifier(${conteneurId})`;

  try {
    const result = await runProlog(module5Path, goal);
    res.json({ conteneurId, result, success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ GESTION DES DONNÉES
============================= */

// ➤ Ajouter un conteneur
app.post('/api/conteneurs', async (req, res) => {
  const { id, flux, danger, type, zone } = req.body;
  if (!id || !flux || !danger || !type || !zone) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const fact = `conteneur(${id}, ${flux}, ${danger}, ${type}, ${zone}).`;

  try {
    const content = await fs.promises.readFile(module1Path, 'utf-8');
    const lines = content.split('\n');

    const headerIndex = lines.findIndex(l => l.includes('% --- CONTENEURS ---'));
    if (headerIndex === -1) {
      return res.status(500).json({ error: 'Section conteneurs introuvable.' });
    }

    let insertIndex = headerIndex + 2;
    while (lines[insertIndex]?.startsWith('conteneur(')) insertIndex++;

    lines.splice(insertIndex, 0, fact);
    await fs.promises.writeFile(module1Path, lines.join('\n'));

    res.json({ message: `✅ Conteneur ${id} ajouté.`, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout.' });
  }
});

// ➤ Ajouter un navire
app.post('/api/navires', async (req, res) => {
  const { id, statut, type, longueur, priorite, capacite, tirant } = req.body;
  if (!id || !statut || !type || !longueur || !priorite || !capacite || !tirant) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const fact = `navire(${id}, ${statut}, ${type}, ${longueur}, ${priorite}, ${capacite}, ${tirant}).`;

  try {
    const content = await fs.promises.readFile(module1Path, 'utf-8');
    const lines = content.split('\n');

    const headerIndex = lines.findIndex(line => line.includes('% priorité = oui | non'));
    if (headerIndex === -1) {
      return res.status(500).json({ error: 'Section navires introuvable' });
    }

    let insertIndex = headerIndex + 2;
    while (lines[insertIndex]?.startsWith('navire(')) insertIndex++;

    lines.splice(insertIndex, 0, fact);
    await fs.promises.writeFile(module1Path, lines.join('\n'));

    res.json({ message: `✅ Navire ${id} ajouté.`, success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du navire.' });
  }
});

// ➤ Lister les conteneurs
app.get('/api/conteneurs', async (req, res) => {
  try {
    const content = await fs.promises.readFile(module1Path, 'utf-8');
    const containerMatches = [...content.matchAll(/conteneur\(([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^)]+)\)/g)];
    
    const containers = containerMatches.map(match => ({
      id: match[1],
      flux: match[2],
      danger: match[3],
      type: match[4],
      zone: match[5]
    }));

    res.json(containers);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des conteneurs.' });
  }
});

// ➤ Lister les navires
app.get('/api/navires', async (req, res) => {
  try {
    const content = await fs.promises.readFile(module1Path, 'utf-8');
    const shipMatches = [...content.matchAll(/navire\(([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^,\s]+),\s*([^)]+)\)/g)];
    
    const ships = shipMatches.map(match => ({
      id: match[1],
      statut: match[2],
      type: match[3],
      longueur: parseFloat(match[4]),
      priorite: match[5],
      capacite: parseInt(match[6]),
      tirant: parseFloat(match[7])
    }));

    res.json(ships);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la lecture des navires.' });
  }
});


// ➤ Supprimer un conteneur
app.delete('/api/supprimer', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'ID requis' });

  try {
    const content = await fs.promises.readFile(module1Path, 'utf-8');
    const updated = content.split('\n').filter(line => !line.trim().startsWith(`conteneur(${id},`)).join('\n');
    await fs.promises.writeFile(module1Path, updated);

    res.json({ message: `🗑️ Conteneur ${id} supprimé.` });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

/* =============================
   ▶ DÉMONSTRATION COMPLÈTE
============================= */

app.post('/api/demo/scenario-complet', async (req, res) => {
  try {
    const results = {};

    // 1. État initial
    results.etat_initial = await runProlog(module3Path, 'afficher_etat');

    // 2. Planification navire
    //results.planification = await runProlog(module1Path, 'planifier_accostage(n001, Quai) -> format("Quai: ~w~n", [Quai]); writeln("Aucun")');

    // 3. Tri conteneurs pour déchargement
    results.tri_dechargement = await runProlog(module2Path, 'exemple');

    // 4. Assignation véhicules
   // results.assignation_vehicule = await runProlog(module3Path, 'assigner_vehicule(ctn201, V) -> format("Véhicule: ~w~n", [V]); writeln("Aucun")');

    // 5. Chargement navires
    results.chargement = await runProlog(module5Path, 'charger_tous_les_navires');

    res.json({
      scenario: 'Démonstration complète du système expert',
      results,
      success: true
    });

  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/* =============================
   ▶ ROUTES STATIQUES
============================= */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'demo.html'));
});

app.get('/conteneurs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'conteneurs.html'));
});

app.get('/navires', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'navires.html'));
});

app.get('/cour', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cour.html'));
});

/* =============================
   ▶ LANCEMENT SERVEUR
============================= */

app.listen(PORT, () => {
  console.log(`✅ Serveur Système Expert Terminal actif sur http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🧪 Démonstration: http://localhost:${PORT}/demo`);
  console.log(`📦 Gestion Conteneurs: http://localhost:${PORT}/conteneurs`);
  console.log(`🚢 Gestion Navires: http://localhost:${PORT}/navires`);
  console.log(`🏗️ Gestion Cour: http://localhost:${PORT}/cour`);
});

module.exports = app;
