// components/SupprimerConteneurForm.tsx
'use client';

import { useEffect, useState } from 'react';
import API_URL from '@/constants/url';

export default function SupprimerConteneurForm() {
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');
  const [conteneurs, setConteneurs] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch(API_URL+'/lister')
      .then((res) => res.json())
      .then((data) => setConteneurs(data || []))
      .catch(() => setConteneurs([]));

    // Animation d’apparition
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm(`Voulez-vous vraiment supprimer le conteneur ${id} ?`)) return;

    try {
      const res = await fetch('/api/supprimer', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setConteneurs(conteneurs.filter(c => c !== id));
        setId('');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage('Erreur réseau ou serveur.');
    }
  };

  return (
    <div className={`transition-all duration-500 ease-out transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} p-6 bg-white rounded-xl shadow mb-6`}>
      <h2 className="text-2xl font-semibold mb-4 text-red-700">🗑️ Supprimer un conteneur</h2>
      <label htmlFor="conteneur-select" className="sr-only">
        Sélectionnez un conteneur à supprimer
      </label>
      <select
        id="conteneur-select"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="border p-2 w-full rounded mb-4"
        aria-label="Sélectionnez un conteneur à supprimer"
      >
        <option value="">-- Sélectionnez un conteneur --</option>
        {conteneurs.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <button
        onClick={handleDelete}
        disabled={!id}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full disabled:opacity-50"
      >
        Supprimer
      </button>

      {message && <p className="mt-4 text-sm text-gray-800">{message}</p>}
    </div>
  );
}
