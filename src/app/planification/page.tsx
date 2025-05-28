'use client';
import { useState } from 'react';
import API_URL from '@/constants/url';

export default function PlanificationNavires() {
  const [navireData, setNavireData] = useState({
    id: '',
    statut: 'arrivee',
    type: 'porte_conteneurs',
    longueur: '',
    priorite: 'non',
    capacite: '',
    tirant: '',
  });

  const [heure, setHeure] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNavireData({ ...navireData, [e.target.name]: e.target.value });
  };

  const enregistrerNavire = async () => {
    const { id, statut, type, longueur, priorite, capacite, tirant } = navireData;
    if (!id || !longueur || !capacite || !tirant) {
      return alert('Veuillez remplir tous les champs obligatoires.');
    }

    try {
      const res = await fetch(API_URL+'/navires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          statut,
          type,
          longueur: Number(longueur),
          priorite,
          capacite: Number(capacite),
          tirant: Number(tirant),
        }),
      });
      const data = await res.json();
      setResult(data.message || data.error);
    } catch (error) {
      setResult('Erreur lors de l’enregistrement.');
    }
  };

  const lancerRequete = async (endpoint: string) => {
    setLoading(true);
    setResult(null);
    try {

    if (!navireData.id) return alert('Veuillez entrer un ID de navire');
    setLoading(true);
    setResult(null);

    const body: any = { id: navireData.id };
    if (heure) body.heure = parseInt(heure);

    console.log(navireData.id);
      const res = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navireId: navireData.id,
          heure: heure ? Number(heure) : undefined,
        }),
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch {
      setResult('Erreur réseau ou serveur');
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">🛳️ Planification & Arrivée des Navires</h1>

        {/* === Formulaire === */}
        <section className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">➕ Enregistrer un navire</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input name="id" value={navireData.id} onChange={handleChange} className="border p-2 rounded" placeholder="ID (ex: n005)" />
            <label htmlFor="statut-select" className="sr-only">Statut</label>
            <select
              id="statut-select"
              name="statut"
              value={navireData.statut}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="arrivee">Arrivée</option>
              <option value="pret">Prêt</option>
            </select>
            <label htmlFor="type-select" className="sr-only">Type de navire</label>
            <select
              id="type-select"
              name="type"
              value={navireData.type}
              onChange={handleChange}
              className="border p-2 rounded"
              aria-label="Type de navire"
            >
              <option value="porte_conteneurs">Porte-conteneurs</option>
              <option value="militaire">Militaire</option>
              <option value="frigo">Frigo</option>
            </select>
            <input name="longueur" value={navireData.longueur} onChange={handleChange} className="border p-2 rounded" type="number" placeholder="Longueur (m)" />
            <input name="capacite" value={navireData.capacite} onChange={handleChange} className="border p-2 rounded" type="number" placeholder="Capacité EVP" />
            <input name="tirant" value={navireData.tirant} onChange={handleChange} className="border p-2 rounded" type="number" step="0.1" placeholder="Tirant d’eau (m)" />
            <label htmlFor="priorite-select" className="sr-only">Priorité</label>
            <select
              id="priorite-select"
              name="priorite"
              value={navireData.priorite}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="oui">Oui (prioritaire)</option>
              <option value="non">Non</option>
            </select>
          </div>
          <button onClick={enregistrerNavire} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Enregistrer
          </button>
        </section>

        {/* === Tests de planification === */}
        <section className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">📊 Tester la planification</h2>
          <input
            type="number"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            placeholder="Heure (optionnelle)"
            className="border p-2 rounded w-full mb-4"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => lancerRequete('planification')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
               📋 Planifier Accostage
            </button>
            <button onClick={() => lancerRequete('accostage')} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Accostage Possible ?
            </button>
            <button onClick={() => lancerRequete('quai')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
             ⚓ Assigner un Quai
            </button>
          </div>
        </section>


          {loading && <p className="text-gray-600">⏳ Traitement en cours...</p>}
        {result && (
          <div className="bg-white border rounded p-4 shadow text-blue-800 font-medium">
            <p>Résultat :</p>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

  );
}
