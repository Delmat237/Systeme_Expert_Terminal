// components/AjouterConteneurForm.tsx
'use client';

import { useState } from 'react';
import API_URL from '@/constants/url';
export default function AjouterConteneurForm() {
  const [formData, setFormData] = useState({
    id: '',
    type: 'import',
    nature: 'normal',
    contenu: 'divers',
    zone: 'zone_a',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(API_URL+'/ajouter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setMessage(data.message || 'Erreur lors de l’ajout');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow mb-8">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">➕ Ajouter un conteneur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="id" placeholder="ID du conteneur (ex: c005)" value={formData.id} onChange={handleChange} required className="border p-2 w-full rounded" />

        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de conteneur
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="import">Import</option>
          <option value="export">Export</option>
        </select>

        <label htmlFor="nature" className="block text-sm font-medium text-gray-700">
          Nature du conteneur
        </label>
        <select
          id="nature"
          name="nature"
          value={formData.nature}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option value="normal">Normal</option>
          <option value="dangereux">Dangereux</option>
        </select>

        <input type="text" name="contenu" placeholder="Contenu (ex: aliments, textile...)" value={formData.contenu} onChange={handleChange} className="border p-2 w-full rounded" />

        <input type="text" name="zone" placeholder="Zone actuelle (ex: zone_a)" value={formData.zone} onChange={handleChange} className="border p-2 w-full rounded" />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
          Ajouter
        </button>

        {message && <p className="text-center mt-4 text-sm text-green-700">{message}</p>}
      </form>
    </div>
  );
}
