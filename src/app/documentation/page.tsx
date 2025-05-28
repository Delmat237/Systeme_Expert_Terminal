'use client';
import Layout from '@/components/Layout';

export default function DocumentationPage() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-white text-gray-800">
        {/* Main Content */}
        <main className="flex-1 p-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-700 mb-6">📘 Documentation du Système Expert</h1>

          <section className="p-6 mb-8 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">🎯 Objectif du système</h2>
            <p className="text-gray-700">
              Ce système expert assiste les opérateurs logistiques d’un terminal à conteneurs en leur fournissant
              une aide à la décision basée sur la logique formelle. Il évalue automatiquement chaque conteneur
              selon son type, sa dangerosité, sa destination et sa zone d’affectation.
            </p>
          </section>

          <section className="mb-6 p-6  bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">⚙️ Modules</h2>
            <ul className="list-disc pl-6">
              <li><strong>Base de connaissances :</strong> Règles + faits Prolog</li>
              <li><strong>Moteur d'inférences :</strong> Exécution via SWI-Prolog</li>
              <li><strong>API :</strong> Pont entre Prolog et l'interface</li>
              <li><strong>UI :</strong> Application Next.js avec formulaire</li>
            </ul>
          </section>

        
          <section className="mb-6 p-6  bg-white rounded-xl shadow">
                      <h2 className="text-2xl font-semibold text-blue-600 mb-2">📨 Requêtes supportées</h2>
                      <ul className="list-disc pl-6">
                        <li><code>isole</code> — Vérifie si un conteneur est classé comme dangereux et doit être isolé.</li>
                        <li><code>zone_reefer</code> — Recherche une zone réfrigérée disponible pour les conteneurs de type "reefers".</li>
                        <li><code>pret_chargement</code> — Vérifie si un conteneur d’export peut être chargé (zone disponible).</li>
                        <li><code>anomalie</code> — Détecte un mauvais placement d’un conteneur reefers dans une zone non adaptée.</li>
                        <li><code>zone_surchargee</code> — Indique si une zone donnée est pleine et ne peut accueillir d’autres conteneurs.</li>
                        <li><code>pret_embarquer</code> — Vérifie si un conteneur peut être embarqué immédiatement (navire prêt et zone disponible).</li>
                        <li><code>attente_prolongee</code> — Signale si un conteneur est en attente depuis plus de 48h dans sa zone.</li>
                        <li><code>conflit_dangereux</code> — Vérifie s’il existe un autre conteneur dangereux dans la même zone (risque).</li>
                      </ul>
          </section>

          <section className="mb-6 p-6  bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">📬 Exemple d’appel API</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">{`POST /api/infer
Content-Type: application/json

{
  "question": "zone_reefer",
  "conteneurs": ["c001"]
}
`}</pre>
            <p className="text-sm mt-2">🔁 <strong>Réponse attendue</strong> :</p>
            <pre className="bg-green-100 p-4 rounded overflow-x-auto text-sm">{`{
  "results": [
    {
      "conteneur": "c001",
      "result": "Zone: zone_a"
    }
  ]
}`}</pre>
<pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm mt-8">{`POST /api/infer
Content-Type: application/json

{
  "question": "conflit_dangereux",
  "conteneurs": ["c001", "c005"]
}
`}</pre>
<p className="text-sm mt-2">🔁 <strong>Réponse attendue</strong> :</p>
<pre className="bg-yellow-100 p-4 rounded overflow-x-auto text-sm">{`{
  "results": [
    {
      "conteneur": "c001",
      "result": "Conflit avec: c005"
    }
  ]
}`}</pre>

<pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm mt-8">{`POST /api/infer
Content-Type: application/json

{
  "question": "attente_prolongee",
  "conteneurs": ["c001"]
}
`}</pre>
<p className="text-sm mt-2">🔁 <strong>Réponse attendue</strong> :</p>
<pre className="bg-red-100 p-4 rounded overflow-x-auto text-sm">{`{
  "results": [
    {
      "conteneur": "c001",
      "result": "true"
    }
  ]
}`}</pre>
          </section>
        </main>
      </div>
    </Layout>
  );
}
