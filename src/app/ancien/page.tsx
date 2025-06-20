'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AjouterConteneurForm from '@/components/AjouterConteneurForm';
import SupprimerConteneurForm from '@/components/SupprimerConteneurForm';
import API_URL from '@/constants/url';
import PlanificationNavires from '@/app/planification/page';

export default function Ancien() {
  const [conteneurs, setConteneurs] = useState('c001');
  const [question, setQuestion] = useState('isole');
  const [result, setResult] = useState<{ conteneur: string; result?: string; error?: string }[] | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleSubmit = async () => {
    const body = {
      question,
      conteneurs: conteneurs.split(',').map(c => c.trim())
    };
    const res = await fetch(API_URL+'/infer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    setResult(data.results);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar navigation responsive */}
        <aside className="w-full lg:w-1/4 p-4 bg-white shadow-md rounded-xl mb-6 lg:mb-0 lg:mr-6 sticky top-4 h-fit z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="lg:hidden mb-4 bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <span>{showMenu ? 'Fermer' : 'Menu'}</span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${showMenu ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          <nav className={`space-y-4 text-left lg:text-left transition-all duration-300 ${showMenu ? 'block' : 'hidden'} lg:block`}>
            <a href="#objectif" className="block text-blue-700 hover:underline">🎯 Objectif</a>
            <a href="#modules" className="block text-blue-700 hover:underline">📦 Modules</a>
            <a href="#requetes" className="block text-blue-700 hover:underline">📨 Requêtes</a>
            <a href="#ajout" className="block text-blue-700 hover:underline">➕ Ajouter un conteneur</a>
            <a href="#supprimer" className="block text-blue-700 hover:underline">🗑️ Supprimer un conteneur</a>
            <a href="#test" className="block text-blue-700 hover:underline">🧪 Tester une requête</a>
            <a href="/documentation" className="block text-blue-700 hover:underline">📘 Documentation</a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 w-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Système Expert - Terminal à Conteneurs</h1>

    
          <PlanificationNavires/>

            

            <section id="requetes" className="mb-8 p-4 sm:p-6 bg-white rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">📨 Requêtes supportées</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><code>isole</code> – Vérifie si un conteneur est dangereux.</li>
                <li><code>zone_reefer</code> – Vérifie si une zone réfrigérée est disponible.</li>
                <li><code>pret_chargement</code> – Vérifie si un conteneur peut être chargé.</li>
                <li><code>anomalie</code> – Détecte les placements anormaux de conteneurs.</li>
                <li><Link href="/documentation" className="hover:underline text-blue-900">Voir plus</Link></li>
              </ul>
            </section>

            <section id="ajout" className="mb-8">
              <AjouterConteneurForm />
            </section>

            <section id="supprimer" className="mb-8">
              <SupprimerConteneurForm />
            </section>

            <section id="test" className="p-4 sm:p-6 bg-white rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">🧪 Tester une requête</h2>
              <input
                type="text"
                value={conteneurs}
                onChange={(e) => setConteneurs(e.target.value)}
                className="border p-2 w-full rounded mb-4"
                placeholder="IDs des conteneurs (ex: c001,c002)"
              />
              {question === 'conflit_dangereux' && (
                    <input
                      type="text"
                      placeholder="ID du second conteneur (ex: c002)"
                      className="border p-2 w-full rounded mb-4"
                      onChange={(e) => {
                        const base = conteneurs.split(',')[0];
                        setConteneurs(`${base},${e.target.value}`);
                      }}
                    />
                  )}

              <label htmlFor="question-select" className="sr-only">
                Choisissez une question
              </label>
              <select
                id="question-select"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border p-2 w-full rounded mb-4"
                aria-label="Choisissez une question"
              >
                <option value="isole">Conteneur dangereux ?</option>
                <option value="zone_reefer">Zone pour reefers</option>
                <option value="pret_chargement">Prêt à charger ?</option>
                <option value="anomalie">Placement anormal ?</option>
                <option value="zone_surchargee">Zones surchargées ?</option>
                <option value="pret_embarquer">Conteneur prêt à embarquer ?</option>
                <option value="attente_prolongee">Attente prolongée ?</option>

                <option value="conflit_dangereux">Conflit dangereux entre 2 conteneurs ?</option>


              </select>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
              >
                Soumettre
              </button>
              {result && (
                <div className="mt-6 space-y-4">
                  {result.map((r, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded shadow border ${
                        r.error
                          ? 'bg-red-100 border-red-300'
                          : r.result === 'true' || r.result?.startsWith('Zone:')
                          ? 'bg-green-100 border-green-300'
                          : 'bg-yellow-100 border-yellow-300'
                      }`}
                    >
                      <strong>Conteneur :</strong> {r.conteneur}<br />
                      <strong>Résultat :</strong>{' '}
                      {r.result?.startsWith('Zone:') ? (
                        <>🧊 Zone adaptée : <strong>{r.result.split(': ')[1]}</strong></>
                      ) : (
                        r.result || r.error
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
}


