# 🧠 Système Expert – Gestion de Terminal à Conteneurs 🚢

> Un système intelligent d’aide à la décision logistique, propulsé par **SWI-Prolog**, **Express.js** et **Next.js**.

---

## 📌 Objectif

Ce système expert permet aux opérateurs d’un terminal à conteneurs de :
- Identifier les **conteneurs dangereux**
- Recommander les **zones adaptées** (ex. : réfrigérées)
- Vérifier la **préparation au chargement**
- Détecter des **anomalies de placement**
- Simuler des **conflits entre conteneurs**

---

## 🧱 Architecture du projet

| Module             | Rôle                                                  |
|--------------------|--------------------------------------------------------|
| `frontend (Next.js)` | Interface utilisateur web (formulaire, visualisation) |
| `backend (Express)`  | API RESTful (interroge la base Prolog)               |
| `base_connaissances.pl` | Faits et règles métier en Prolog                    |

---

## 🚀 Déploiement

### 🔹 Frontend sur Vercel

```bash
# Depuis le dossier frontend (Next.js)
npm install
npm run build
# Déploiement
vercel

    Configure .env.local :

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

🔹 Backend sur Render

    Créer un nouveau service Web Node.js

    Ajouter server.js comme point d’entrée

    Ajouter un fichier base_connaissances.pl dans le répertoire racine

    Ajouter la build command :

npm install

🔍 Routes API
POST /infer

    Interroge une règle métier Prolog

{
  "question": "isole",
  "conteneurs": ["c001", "c002"]
}

POST /ajouter

    Ajoute un nouveau conteneur dans la base

{
  "id": "c010",
  "type": "export",
  "nature": "dangereux",
  "contenu": "divers",
  "zone": "zone_a"
}

DELETE /supprimer

    Supprime un conteneur

{
  "id": "c010"
}

GET /lister

    Renvoie tous les IDs de conteneurs présents

["c001", "c002", "c005"]

📄 Requêtes supportées
Code	Description
isole	Est-il dangereux ?
zone_reefer	Quelle zone réfrigérée est disponible ?
pret_chargement	Peut-il être chargé ?
anomalie	Est-il mal placé ?
zone_surchargee	Est-il dans une zone pleine ?
pret_embarquer	Est-il prêt à être embarqué ?
attente_prolongee	En attente depuis plus de 48h ?
conflit_dangereux	Conflit entre conteneurs dangereux ?
🛠 Technologies

    🧠 SWI-Prolog

    🔧 Node.js / Express

    🌐 Next.js (React)

    ☁️ Vercel & Render

👨‍💻 Auteur

    AZANGUE Leonel Delmat – Mai 2025

    Projet académique — GI / Systèmes Formels & IA

📦 Dossier de base

.
├── base_connaissances.pl     # Base Prolog
├── server.js                 # Backend Express
├── frontend/                 # Frontend Next.js
│   ├── pages/                # Interface
│   └── components/           # Formulaires, Layout, etc.
└── README.md

🧪 Exemple visuel

📸 Ajoute une capture de ton interface ici pour démontrer l'interaction utilisateur.
📬 Contribution

Pull requests, améliorations de règles Prolog, extensions vers des modules navires ou douanes : bienvenus !
