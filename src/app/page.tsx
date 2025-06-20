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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12 px-4 md:px-8 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            🧠 Système Expert - Terminal à Conteneurs
          </h1>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Interface d'administration et de test des requêtes Prolog pour la gestion logistique portuaire
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto py-8 px-4 md:px-8">
        {/* Sidebar navigation responsive */}
        <aside className="w-full lg:w-72 p-4 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl mb-6 lg:mb-0 lg:mr-8 lg:sticky top-4 h-fit shadow-lg">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="lg:hidden mb-4 bg-indigo-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 w-full hover:bg-indigo-700 transition-colors"
          >
            <span className="font-medium">{showMenu ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${showMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <nav className={`space-y-3 text-left transition-all ${showMenu ? 'block animate-fadeIn' : 'hidden'} lg:block`}>
            <h3 className="font-bold text-indigo-800 text-lg mb-2 px-2">Navigation</h3>
            {[
              { id: 'requetes', label: '📨 Requêtes', color: 'text-pink-700' },
              { id: 'ajout', label: '➕ Ajouter conteneur', color: 'text-green-700' },
              { id: 'supprimer', label: '🗑️ Supprimer conteneur', color: 'text-red-700' },
              { id: 'test', label: '🧪 Tester requête', color: 'text-yellow-700' },
            ].map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`block py-3 px-4 rounded-lg font-medium hover:bg-white hover:shadow transition-all ${item.color} hover:translate-x-1`}
              >
                {item.label}
              </a>
            ))}
            <Link 
              href="/documentation" 
              className="block py-3 px-4 rounded-lg font-medium text-blue-900 hover:bg-white hover:shadow transition-all"
            >
              📘 Documentation
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Planification des navires</h2>
            </div>
            <div className="p-4">
              <PlanificationNavires />
            </div>
          </div>

          {/* Requêtes supportées */}
          <section id="requetes" className="mt-8 bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
            <div className="bg-pink-50 px-6 py-4 border-b border-pink-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📨</span> Requêtes supportées
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { code: 'isole', desc: 'Vérifie si un conteneur est dangereux' },
                  { code: 'zone_reefer', desc: 'Vérifie si une zone réfrigérée est disponible' },
                  { code: 'pret_chargement', desc: 'Vérifie si un conteneur peut être chargé' },
                  { code: 'anomalie', desc: 'Détecte les placements anormaux' },
                  { code: 'zone_surchargee', desc: 'Identifie les zones surchargées' },
                  { code: 'conflit_dangereux', desc: 'Détecte les conflits entre conteneurs' },
                ].map((req, index) => (
                  <div key={index} className="flex items-start p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                    <code className="bg-gray-200 px-3 py-1 rounded-lg text-sm font-mono mr-3">{req.code}</code>
                    <span className="text-gray-700">{req.desc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/documentation" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Voir toutes les requêtes
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Formulaire d'ajout */}
          <section id="ajout" className="mt-8 bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">➕</span> Ajouter un conteneur
              </h2>
            </div>
            <div className="p-6">
              <AjouterConteneurForm />
            </div>
          </section>

          {/* Formulaire de suppression */}
          <section id="supprimer" className="mt-8 bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🗑️</span> Supprimer un conteneur
              </h2>
            </div>
            <div className="p-6">
              <SupprimerConteneurForm />
            </div>
          </section>

          {/* Tester une requête */}
          <section id="test" className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-yellow-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">🧪</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tester une requête</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="conteneurs-input">
                  IDs des conteneurs
                </label>
                <input
                  type="text"
                  id="conteneurs-input"
                  value={conteneurs}
                  onChange={(e) => setConteneurs(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: c001, c002"
                />
              </div>
              
              {question === 'conflit_dangereux' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="second-conteneur">
                    ID du second conteneur
                  </label>
                  <input
                    type="text"
                    id="second-conteneur"
                    placeholder="Ex: c002"
                    className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const base = conteneurs.split(',')[0];
                      setConteneurs(`${base},${e.target.value}`);
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="question-select">
                  Sélectionner une requête
                </label>
                <select
                  id="question-select"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center]"
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
              </div>
              
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              >
                Exécuter la requête
              </button>
              
              {result && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Résultats :</h3>
                  {result.map((r, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border-l-4 shadow-md ${
                        r.error
                          ? 'border-red-500 bg-red-50'
                          : r.result === 'true' || r.result?.startsWith('Zone:')
                          ? 'border-green-500 bg-green-50'
                          : 'border-yellow-500 bg-yellow-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-800">Conteneur: <span className="font-mono">{r.conteneur}</span></div>
                          <div className="mt-2">
                            <strong>Résultat:</strong>{' '}
                            {r.result?.startsWith('Zone:') ? (
                              <span className="inline-flex items-center bg-blue-100 text-blue-800 py-1 px-3 rounded-full mt-1">
                                <span className="mr-1">🧊</span> Zone adaptée: <strong className="ml-1">{r.result.split(': ')[1]}</strong>
                              </span>
                            ) : r.error ? (
                              <span className="text-red-700">{r.error}</span>
                            ) : (
                              <span className={r.result === 'true' ? 'text-green-700 font-bold' : 'text-yellow-700 font-bold'}>
                                {r.result}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`text-2xl ${r.error ? 'text-red-500' : r.result === 'true' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {r.error ? '❌' : r.result === 'true' ? '✅' : '⚠️'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}