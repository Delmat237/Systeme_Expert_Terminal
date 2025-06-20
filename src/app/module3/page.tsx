'use client';
import { useState } from 'react';
import Layout from '@/components/Layout';

export default function Module3Test() {
  const [activeSection, setActiveSection] = useState('assigner-vehicule');
  const [conteneurId, setConteneurId] = useState('ctn201');
  const [vehiculeId, setVehiculeId] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (action: string) => {
    setLoading(true);
    setResult('');
    
    try {
      // Simuler un appel API au backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer des résultats basés sur l'action demandée
      switch(action) {
        case 'assigner-vehicule':
          if (vehiculeId) {
            setResult(`✅ Véhicule ${vehiculeId} assigné avec succès au conteneur ${conteneurId}`);
          } else {
            setResult(`✅ Véhicule AGV-03 assigné au conteneur ${conteneurId}`);
          }
          break;
        case 'assigner-zone':
          setResult(`✅ Zone ZONE-B assignée au conteneur ${conteneurId}`);
          break;
        case 'gerer-reefer':
          setResult(`✅ Conteneur reefer ${conteneurId} placé en zone réfrigérée`);
          break;
        case 'choisir-grue':
          setResult(`✅ Grue RTG-02 sélectionnée pour le conteneur ${conteneurId}`);
          break;
        case 'etat-systeme':
          setResult(`📊 État du système:
• Conteneurs: 42
• Véhicules disponibles: 8
• Zones occupées: 75%
• Grues actives: 3/5`);
          break;
        default:
          setResult('❌ Action non reconnue');
      }
    } catch (error) {
      setResult('❌ Erreur lors de l\'exécution de la requête');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch(activeSection) {
      case 'assigner-vehicule':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ID du conteneur
              </label>
              <input
                type="text"
                value={conteneurId}
                onChange={(e) => setConteneurId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ctn201"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ID du véhicule (optionnel)
              </label>
              <input
                type="text"
                value={vehiculeId}
                onChange={(e) => setVehiculeId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: agv01"
              />
              <p className="text-sm text-gray-500 mt-1">Laissez vide pour une assignation automatique</p>
            </div>
            
            <button
              onClick={() => handleSubmit('assigner-vehicule')}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Assigner un véhicule'}
            </button>
          </div>
        );
      
      case 'assigner-zone':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ID du conteneur
              </label>
              <input
                type="text"
                value={conteneurId}
                onChange={(e) => setConteneurId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ctn201"
              />
            </div>
            
            <button
              onClick={() => handleSubmit('assigner-zone')}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Assigner une zone'}
            </button>
          </div>
        );
      
      case 'gerer-reefer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ID du conteneur reefer
              </label>
              <input
                type="text"
                value={conteneurId}
                onChange={(e) => setConteneurId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ctn202"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Température requise (°C)
              </label>
              <input
                type="number"
                defaultValue="-15"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => handleSubmit('gerer-reefer')}
              className="bg-gradient-to-r from-cyan-600 to-teal-700 hover:from-cyan-700 hover:to-teal-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Placer le conteneur reefer'}
            </button>
          </div>
        );
      
      case 'choisir-grue':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ID du conteneur
              </label>
              <input
                type="text"
                value={conteneurId}
                onChange={(e) => setConteneurId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: ctn201"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Poids du conteneur (tonnes)
              </label>
              <input
                type="number"
                defaultValue="18"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => handleSubmit('choisir-grue')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Traitement...' : 'Sélectionner une grue'}
            </button>
          </div>
        );
      
      case 'etat-systeme':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                Cette fonction affiche l'état actuel du système de gestion de la cour, 
                incluant les conteneurs, véhicules, zones de stockage et grues disponibles.
              </p>
            </div>
            
            <button
              onClick={() => handleSubmit('etat-systeme')}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-700 hover:to-fuchsia-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full"
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Afficher l\'état du système'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🏗️ Module 3 - Gestion de la Cour
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Testez les fonctionnalités d'optimisation du stockage et du mouvement des conteneurs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navigation latérale */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Fonctionnalités</h2>
                <nav className="space-y-2">
                  {[
                    { id: 'assigner-vehicule', label: 'Assigner véhicule', icon: '🚛' },
                    { id: 'assigner-zone', label: 'Assigner zone', icon: '📍' },
                    { id: 'gerer-reefer', label: 'Gérer reefers', icon: '🧊' },
                    { id: 'choisir-grue', label: 'Choisir grue', icon: '🏗️' },
                    { id: 'etat-systeme', label: 'État du système', icon: '📊' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 transition-all ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 font-medium shadow-inner'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">
                    {activeSection === 'assigner-vehicule' && 'Assigner un véhicule à un conteneur'}
                    {activeSection === 'assigner-zone' && 'Assigner une zone de stockage'}
                    {activeSection === 'gerer-reefer' && 'Gérer un conteneur reefer'}
                    {activeSection === 'choisir-grue' && 'Sélectionner une grue RTG'}
                    {activeSection === 'etat-systeme' && 'Afficher l\'état du système'}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-8">
                    {renderForm()}
                  </div>
                  
                  {result && (
                    <div className={`mt-6 p-4 rounded-xl border-l-4 ${
                      result.startsWith('✅') 
                        ? 'border-green-500 bg-green-50' 
                        : result.startsWith('❌')
                          ? 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">
                          {result.startsWith('✅') ? '✅' : result.startsWith('❌') ? '❌' : '📋'}
                        </div>
                        <div className="whitespace-pre-line font-mono text-gray-800">{result}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2">À propos du Module 3</h3>
                    <p className="text-gray-600">
                      Le module de gestion de la cour optimise le stockage et le mouvement des conteneurs 
                      dans la zone de cour avec minimisation des déplacements inutiles. Il utilise un système 
                      expert Prolog pour l'allocation dynamique des zones et la gestion des grues RTG.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow">
                  <h3 className="font-bold text-gray-800 mb-3">Fonctionnalités clés</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Gestion intelligente des grues RTG
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Allocation dynamique des zones
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Stratégies d'empilage intelligentes
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Gestion des conteneurs spéciaux
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow">
                  <h3 className="font-bold text-gray-800 mb-3">Bénéfices</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      Réduction de 30% des temps de manutention
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      Optimisation de l'espace de stockage
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      Minimisation des déplacements inutiles
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      Gestion automatisée des conteneurs reefers
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}