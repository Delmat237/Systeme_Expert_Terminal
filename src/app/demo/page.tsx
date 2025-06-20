'use client';
import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

// URL de base de l'API - à adapter selon l'environnement
const API_BASE_URL = 'http://localhost:5000';

export default function DemoPage() {
  // État pour les modules sélectionnés
  const [modules, setModules] = useState({
    module1: true,
    module2: true,
    module3: true,
    module4: true,
    module5: true,
    module6: true
  });

  // Configuration du navire
  const [shipConfig, setShipConfig] = useState({
    name: "MSC Kristina",
    length: 320,
    draft: 14.5,
    containerCount: 3500,
    cargoType: "generale",
    percentImport: 60,
    percentExport: 30,
    percentTransbord: 10,
    weather: "favorable",
    priority: "normale",
    arrivalTime: "08:00"
  });

  // État pour la simulation
  const [simulationStatus, setSimulationStatus] = useState('ready'); // ready, running, completed
  const [progress, setProgress] = useState(0);
  const [logEntries, setLogEntries] = useState([
    { type: 'info', message: '🚢 Système Expert Terminal à Conteneurs initialisé', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [showResults, setShowResults] = useState(false);
  const [showLog, setShowLog] = useState(true);
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  
  // Références
  const resultsRef = useRef<HTMLDivElement>(null);
  const logContentRef = useRef<HTMLDivElement>(null);

  // Gestion des modules
  const toggleModule = (module: keyof typeof modules) => {
    setModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  // Mise à jour de la configuration
  const handleConfigChange = (field: keyof typeof shipConfig, value: any) => {
    setShipConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Ajouter une entrée au journal
  const addLogEntry = (message: string, type: 'info' | 'error' | 'success' | 'process' = 'info') => {
    setLogEntries(prev => [
      ...prev,
      { type, message, timestamp: new Date().toLocaleTimeString() }
    ]);
    
    setTimeout(() => {
      logContentRef.current?.scrollTo({
        top: logContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Exécuter le scénario complet
  const executeFullScenario = async () => {
    setSimulationStatus('running');
    setShowResults(true);
    setProgress(0);
    setScenarioResults(null);
    setLogEntries([
      { type: 'info', message: '🚀 Démarrage du scénario complet...', timestamp: new Date().toLocaleTimeString() }
    ]);

    // Scroll vers les résultats
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    try {
      // Appel API pour le scénario complet
      addLogEntry('📡 Connexion au serveur Prolog...', 'process');
      
      const response = await fetch(`${API_BASE_URL}/api/demo/scenario-complet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setScenarioResults(data.results);
      
      // Mise à jour de la progression
      const steps = Object.keys(data.results);
      steps.forEach((step, index) => {
        setTimeout(() => {
          setProgress(Math.round((index + 1) / steps.length * 100));
          addLogEntry(`✅ ${step} terminé`, 'success');
        }, (index + 1) * 1500);
      });

      setTimeout(() => {
        setSimulationStatus('completed');
        addLogEntry('🏁 Simulation complète terminée avec succès', 'success');
      }, steps.length * 1500 + 500);

    } catch (error: any) {
      setSimulationStatus('error');
      addLogEntry(`❌ Erreur: ${error.message || 'Échec de la simulation'}`, 'error');
      console.error('Erreur simulation:', error);
    }
  };

  // Exécuter étape par étape
  const executeStepByStep = async () => {
    setSimulationStatus('running');
    setShowResults(true);
    setProgress(0);
    setScenarioResults(null);
    setLogEntries([
      { type: 'info', message: '🚀 Démarrage étape par étape...', timestamp: new Date().toLocaleTimeString() }
    ]);

    // Scroll vers les résultats
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);

    // Définition des étapes de simulation
    const steps = [
      { 
        name: 'Planification et Accostage des navires', 
        api: '/api/navires/planification',
        data: { navireId: 'n001' },
        module: 'module1'
      },
      { 
        name: 'Déchargement', 
        api: '/api/dechargement/trier',
        data: { 
          conteneurs: [
            { id: 'ctn001', baie: 1, lateral: 2, tier: 3, poids: 4.5, destination: 'import' },
            { id: 'ctn002', baie: 2, lateral: 3, tier: 4, poids: 3.8, destination: 'export' }
          ] 
        },
        module: 'module2'
      },
      { 
        name: 'Gestion cour', 
        api: '/api/cour/assigner-vehicule',
        data: { conteneurId: 'ctn201' },
        module: 'module3'
      },
      { 
        name: 'Douane', 
        api: '/api/infer/conteneurs',
        data: { 
          question: 'pret_chargement',
          conteneurs: ['ctn301', 'ctn302'] 
        },
        module: 'module4'
      },
      { 
        name: 'Chargement', 
        api: '/api/chargement/charger-tous',
        module: 'module5'
      },
      { 
        name: 'Sortie', 
        api: '/api/infer/conteneurs',
        data: { 
          question: 'pret_embarquer',
          conteneurs: ['ctn401', 'ctn402'] 
        },
        module: 'module6'
      }
    ];

    try {
      const results: any = {};
      
      for (const [index, step] of steps.entries()) {
        if (!modules[step.module as keyof typeof modules]) {
          addLogEntry(`⏩ ${step.name} ignoré (module désactivé)`, 'info');
          continue;
        }

        addLogEntry(`🔄 Exécution: ${step.name}...`, 'process');
        
        const response = await fetch(`${API_BASE_URL}${step.api}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(step.data || {})
        });

        if (!response.ok) {
          throw new Error(`Erreur étape ${step.name}: ${response.status}`);
        }

        const data = await response.json();
        results[step.name] = data;
        
        setProgress(Math.round((index + 1) / steps.length * 100));
        addLogEntry(`✅ ${step.name} réussi`, 'success');
      }

      setScenarioResults(results);
      setSimulationStatus('completed');
      addLogEntry('🏁 Toutes les étapes terminées avec succès', 'success');
      
    } catch (error: any) {
      setSimulationStatus('error');
      addLogEntry(`❌ Erreur: ${error.message || 'Échec de la simulation'}`, 'error');
      console.error('Erreur simulation étape par étape:', error);
    }
  };

  // Réinitialisation
  const resetSimulation = () => {
    setSimulationStatus('ready');
    setProgress(0);
    setLogEntries([
      { type: 'info', message: '🚢 Système réinitialisé', timestamp: new Date().toLocaleTimeString() }
    ]);
    setShowResults(false);
    setScenarioResults(null);
  };

  // Exporter les résultats
  const exportResults = (format: 'json' | 'csv' | 'pdf') => {
    addLogEntry(`📤 Export des résultats au format ${format.toUpperCase()}...`, 'process');
    
    if (format === 'json') {
      const dataStr = JSON.stringify(scenarioResults, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `resultats-simulation-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addLogEntry('✅ Export JSON terminé', 'success');
    } else {
      addLogEntry(`❌ Format ${format.toUpperCase()} non implémenté`, 'error');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🚀 Démonstration du Système Expert</h1>
          <h2>Simulation complète des opérations portuaires</h2>
          <p className="subtitle">
            Testez en temps réel les capacités d'optimisation du système
          </p>
          <p className="description">
            Configurez votre scénario, lancez la simulation et observez les résultats d'optimisation pour chaque module opérationnel.
          </p>
          <div className="hero-buttons">
            <button 
              onClick={() => executeFullScenario()}
              className="cta-button primary"
            >
              🚀 Lancer la Simulation
            </button>
            <button 
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="cta-button secondary"
            >
              📊 Voir les Résultats
            </button>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="modules-section" id="configuration">
        <div className="container">
          <h2>⚙️ Configuration de la Simulation</h2>
          <p className="section-subtitle">Définissez les paramètres du navire et des opérations</p>
          
          <div className="config-grid">
            {/* Module Selector */}
            <div className="config-section">
              <h3>📋 Modules à Simuler</h3>
              <div className="modules-grid">
                {Object.entries(modules).map(([key, value]) => {
                  const moduleId = key as keyof typeof modules;
                  const moduleInfo = {
                    module1: { icon: '⚓', name: 'Planification et Accostage des navires' },
                    module2: { icon: '🏗️', name: 'Déchargement' },
                    module3: { icon: '📦', name: 'Cour' },
                    module4: { icon: '🛂', name: 'Douane' },
                    module5: { icon: '🚛', name: 'Chargement' },
                    module6: { icon: '🚪', name: 'Sortie' },
                  }[moduleId];

                  return (
                    <div 
                      key={moduleId}
                      className={`module-toggle ${value ? 'active' : ''}`}
                      onClick={() => toggleModule(moduleId)}
                    >
                      <div className="module-icon">{moduleInfo.icon}</div>
                      <div className="module-info">
                        <h4>Module {moduleId.slice(-1)}</h4>
                        <p>{moduleInfo.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ship Configuration */}
            <div className="config-section">
              <h3>🚢 Paramètres du Navire</h3>
              <div className="form-group">
                <label>Nom du navire</label>
                <input 
                  type="text" 
                  value={shipConfig.name}
                  onChange={(e) => handleConfigChange('name', e.target.value)}
                  placeholder="Ex: MSC Kristina"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Longueur (m)</label>
                  <input 
                    type="number" 
                    value={shipConfig.length}
                    onChange={(e) => handleConfigChange('length', Number(e.target.value))}
                    min="50" 
                    max="400"
                  />
                </div>
                <div className="form-group">
                  <label>Tirant d'eau (m)</label>
                  <input 
                    type="number" 
                    value={shipConfig.draft}
                    onChange={(e) => handleConfigChange('draft', Number(e.target.value))}
                    min="5" 
                    max="20" 
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Nombre de conteneurs (EVP)</label>
                <input 
                  type="number" 
                  value={shipConfig.containerCount}
                  onChange={(e) => handleConfigChange('containerCount', Number(e.target.value))}
                  min="100" 
                  max="20000"
                />
              </div>
            </div>

            {/* Cargo and Conditions */}
            <div className="config-section">
              <h3>📦 Cargaison & Conditions</h3>
              
              <div className="form-group">
                <label>Type de cargaison</label>
                <select 
                  value={shipConfig.cargoType}
                  onChange={(e) => handleConfigChange('cargoType', e.target.value)}
                >
                  <option value="generale">Marchandise générale</option>
                  <option value="refrigeree">Marchandise réfrigérée</option>
                  <option value="dangereuse">Marchandise dangereuse</option>
                  <option value="mixte">Cargaison mixte</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>% Import</label>
                  <input 
                    type="number" 
                    value={shipConfig.percentImport}
                    onChange={(e) => handleConfigChange('percentImport', Number(e.target.value))}
                    min="0" 
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>% Export</label>
                  <input 
                    type="number" 
                    value={shipConfig.percentExport}
                    onChange={(e) => handleConfigChange('percentExport', Number(e.target.value))}
                    min="0" 
                    max="100"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Météo</label>
                  <select 
                    value={shipConfig.weather}
                    onChange={(e) => handleConfigChange('weather', e.target.value)}
                  >
                    <option value="favorable">Favorable</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="defavorable">Défavorable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priorité</label>
                  <select 
                    value={shipConfig.priority}
                    onChange={(e) => handleConfigChange('priority', e.target.value)}
                  >
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="control-buttons">
            <button 
              className="cta-button primary"
              onClick={() => executeFullScenario()}
              disabled={simulationStatus === 'running'}
            >
              🚀 Lancer Simulation Complète
            </button>
            
            <button 
              className="cta-button secondary"
              onClick={() => executeStepByStep()}
              disabled={simulationStatus === 'running'}
            >
              📝 Exécution Étape par Étape
            </button>
            
            <button 
              className="cta-button tertiary"
              onClick={resetSimulation}
            >
              🔄 Réinitialiser
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section" id="results" ref={resultsRef}>
        <div className="container">
          <h2>📊 Résultats de la Simulation</h2>
          <p className="section-subtitle">
            {simulationStatus === 'completed' 
              ? 'Simulation terminée avec succès' 
              : simulationStatus === 'running' 
                ? 'Simulation en cours...' 
                : 'Les résultats apparaîtront ici'}
          </p>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {progress}% completé
            </div>
          </div>
          
          {/* Module Results */}
          <div className="modules-results">
            {Object.entries(modules).map(([key, active]) => {
              if (!active) return null;
              
              const moduleId = key as keyof typeof modules;
              const moduleInfo = {
                module1: { icon: '⚓', name: 'Planification et Accostage des navires', color: 'blue' },
                module2: { icon: '🏗️', name: 'Déchargement', color: 'teal' },
                module3: { icon: '📦', name: 'Cour', color: 'orange' },
                module4: { icon: '🛂', name: 'Douane', color: 'purple' },
                module5: { icon: '🚛', name: 'Chargement', color: 'green' },
                module6: { icon: '🚪', name: 'Sortie', color: 'red' },
              }[moduleId];

              return (
                <div 
                  key={moduleId}
                  className={`module-result ${moduleInfo.color}`}
                >
                  <div className="module-header">
                    <div className="module-icon">{moduleInfo.icon}</div>
                    <h3>Module {moduleId.slice(-1)} - {moduleInfo.name}</h3>
                  </div>
                  <div className="module-status">
                    {simulationStatus === 'completed' ? (
                      <span className="success">✅ Opération réussie</span>
                    ) : simulationStatus === 'running' ? (
                      <span className="processing">⏳ En cours...</span>
                    ) : simulationStatus === 'error' ? (
                      <span className="error">❌ Erreur d'exécution</span>
                    ) : (
                      <span>En attente de simulation</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Detailed Results */}
          {scenarioResults && (
            <div className="detailed-results">
              <h3>📝 Synthèse des Résultats</h3>
              <div className="results-grid">
                <div className="result-card">
                  <div className="stat-number">2h 45min</div>
                  <div className="stat-label">Temps total</div>
                </div>
                <div className="result-card">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Taux de réussite</div>
                </div>
                <div className="result-card">
                  <div className="stat-number">24%</div>
                  <div className="stat-label">Réduction immobilisation</div>
                </div>
                <div className="result-card">
                  <div className="stat-number">3500</div>
                  <div className="stat-label">Conteneurs traités</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="export-options">
            <h3>📥 Exporter les Résultats</h3>
            <div className="export-buttons">
              <button 
                className="cta-button primary"
                onClick={() => exportResults('json')}
              >
                📄 Format JSON
              </button>
              <button 
                className="cta-button primary"
                onClick={() => exportResults('csv')}
              >
                📊 Format CSV
              </button>
              <button 
                className="cta-button primary"
                onClick={() => exportResults('pdf')}
              >
                📑 Rapport PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Log Console */}
      <section className="log-section">
        <div className="container">
          <h2>📝 Console d'Exécution</h2>
          <p className="section-subtitle">Suivez le déroulement de la simulation en temps réel</p>
          
          <div className="log-console">
            <div className="log-header">
              <h3>🖥️ Journal Prolog</h3>
              <div className="log-controls">
                <button onClick={() => setLogEntries([])}>
                  🗑️ Effacer
                </button>
                <button onClick={() => setShowLog(!showLog)}>
                  {showLog ? '📋 Masquer' : '📋 Afficher'}
                </button>
              </div>
            </div>
            
            <div 
              className={`log-content ${showLog ? 'visible' : 'hidden'}`}
              ref={logContentRef}
            >
              {logEntries.map((entry, index) => (
                <div 
                  key={index} 
                  className={`log-entry ${entry.type}`}
                >
                  <span className="timestamp">[{entry.timestamp}]</span>
                  <span className="message">{entry.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>🚀 Prêt à optimiser vos opérations portuaires ?</h2>
          <p>Découvrez comment notre système expert peut transformer votre gestion logistique</p>
          <div className="cta-buttons">
            <button 
              className="cta-button primary large"
              onClick={() => executeFullScenario()}
            >
              🚀 Relancer une Simulation
            </button>
            <Link href="/contact" className="cta-button secondary large">
              📞 Contactez notre Équipe
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );

}