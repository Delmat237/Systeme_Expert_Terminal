'use client';
import { useState } from 'react';

import Layout from '@/components/Layout';
import ModuleSelector from '@/components/ModuleSelector';

export default function Home() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState('');
  const [activeModule, setActiveModule] = useState('base');


const modules = [
  { 
    id: '⚓',
    name: 'Module 1 - Planification et Accostage des navires', 
    description: 'Optimisation des opérations d\'accostage en fonction des caractéristiques des navires, des conditions météorologiques et des disponibilités des quais.',
    module_features: [
      "Attribution dynamique des quais",
      "Analyse du tirant d'eau",
      "Gestion des créneaux horaires",
      "Suivi météorologique en temps réel",
      "Priorisation des navires"
    ]
  },
  { 
    id: '🏗️',
    name: 'Module 2 - Déchargement STS (Ship-to-Shore)', 
    description: "Optimisation des opérations de déchargement avec maximisation de l'utilisation des portiques et réduction des temps d'immobilisation des navires.",
    module_features: [
      "Gestion intelligente des portiques",
      "Système de capteurs IoT",
      "Intégration avec le TOS",
      "Reconnaissance automatique des conteneurs",
      "Synchronisation avec le transport terrestre"
    ]
  },
  { 
    id: '📦',
    name: 'Module 3 - Opérations de cour (Yard Management)', 
    description: "Optimisation du stockage et du mouvement des conteneurs dans la zone de cour avec minimisation des déplacements inutiles.",
    module_features: [
      "Gestion des grues RTG",
      "Allocation dynamique des zones",
      "Stratégies d'empilage intelligentes",
      "Optimisation des trajectoires",
      "Gestion des conteneurs spéciaux"
    ]
  },
  { 
    id: '🛂',
    name: 'Module 4 - Processus douanier', 
    description: 'Automatisation des procédures administratives et gestion des contrôles douaniers.',
    module_features: [
      "Interface CAMCIS",
      "Vérification automatisée des documents",
      "Gestion des inspections",
      "Suivi des conteneurs à risque",
      "Archivage numérique"
    ]
  },
  { 
    id: '🚛',
    name: 'Module 5 - Chargement pour export', 
    description: "Planification optimale du chargement des navires en fonction de leur stabilité et des destinations.",
    module_features: [
      "Génération automatique des plans de chargement",
      "Calcul de stabilité en temps réel",
      "Gestion des scellés",
      "Coordination avec les opérations de cour",
      "Optimisation de l'équilibrage"
    ]
  },
  { 
    id: '🚪',
    name: 'Module 6 - Sortie portuaire', 
    description: "Gestion optimisée du flux des conteneurs vers les transports terrestres et contrôle des sorties.",
    module_features: [
      "Planification des transports",
      "Gestion des portes d'accès",
      "Contrôles automatisés",
      "Coordination avec les douanes",
      "Suivi en temps réel"
    ]
  }
];

  const handleExecute = async () => {
    try {
   
      // const response = await fetch('/api/prolog', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code, module: activeModule })
      // });
      const response = await fetch('https://rsm-z3xm.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "email": "azangueleonel9@gmail.com",
          "motDePasse": "azaleodel"
        })
      });
      const data = await response.json();
      console.log('Prolog response:', data);
      setResults(data.result || data.error);
    } catch (error) {
      setResults('Error executing query');
    }
  };

  return (
    <Layout>
                {/* <!-- Section Hero --> */}
    <section className="hero">
        <div className="hero-content">
            <h1>🚢 Système Expert pour la Gestion Logistique</h1>
            <h2>Terminal à Conteneurs - Port Autonome de Kribi</h2>
            <p className="subtitle">
                Intelligence Artificielle avancée pour l'optimisation complète des opérations portuaires
            </p>
            <p className="description">
                Système expert modulaire basé sur Prolog intégrant tous les processus logistiques : 
                accostage, déchargement, stockage, douane, chargement et sortie.
            </p>
            <div className="hero-buttons">
                <a href="/" className="cta-button primary">
                    🚀 Lancer le Système Expert
                </a>
                <a href="#modules" className="cta-button secondary">
                    📋 Explorer les Modules
                </a>
            </div>
        </div>
    </section>

     {/* <!-- Section Modules --> */}
        <section className="modules-section" id="modules">
            <div className="lg:col-span-1 space-y-4">
              <ModuleSelector 
                modules={modules} 
                activeModule={activeModule}
                onChange={setActiveModule}
              />
              </div>
          </section>

  {/* <!-- Section Processus --> */}
    <section className="process-section" id="process">
        <div className="container">
            <h2>⚙️ Flux Logistique Intégré</h2>
            <p className="section-subtitle">Processus complet de la gestion d'un terminal à conteneurs</p>
            
            <div className="process-flow">
                <div className="process-step" data-step="1">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <h3>Arrivée & Accostage</h3>
                        <p>Attribution automatique des quais selon les contraintes physiques et météorologiques</p>
                    </div>
                </div>
                
                <div className="process-arrow">→</div>
                
                <div className="process-step" data-step="2">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <h3>Déchargement</h3>
                        <p>Utilisation optimale des portiques STS avec inspection et enregistrement TOS</p>
                    </div>
                </div>
                
                <div className="process-arrow">→</div>
                
                <div className="process-step" data-step="3">
                    <div className="step-number">3</div>
                    <div className="step-content">
                        <h3>Stockage</h3>
                        <p>Empilage intelligent selon le type et la destination des conteneurs</p>
                    </div>
                </div>
                
                <div className="process-arrow">→</div>
                
                <div className="process-step" data-step="4">
                    <div className="step-number">4</div>
                    <div className="step-content">
                        <h3>Contrôles Douaniers</h3>
                        <p>Vérification documents, inspections et clearance administrative</p>
                    </div>
                </div>
                
                <div className="process-arrow">→</div>
                
                <div className="process-step" data-step="5">
                    <div className="step-number">5</div>
                    <div className="step-content">
                        <h3>Chargement Export</h3>
                        <p>Préparation et chargement avec optimisation de la stabilité</p>
                    </div>
                </div>
                
                <div className="process-arrow">→</div>
                
                <div className="process-step" data-step="6">
                    <div className="step-number">6</div>
                    <div className="step-content">
                        <h3>Sortie Port</h3>
                        <p>Transport terrestre et gestion des flux aux portes</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Section Technologie --> */}
    <section className="tech-section" id="technology">
        <div className="container">
            <h2>🛠️ Architecture Technique</h2>
            <div className="tech-grid">
                <div className="tech-card">
                    <div className="tech-icon">🧠</div>
                    <h3>Moteur Prolog</h3>
                    <p>Base de connaissances avec faits et règles d'inférence pour chaque module</p>
                </div>
                <div className="tech-card">
                    <div className="tech-icon">⚡</div>
                    <h3>JavaScript ES6+</h3>
                    <p>Interface moderne et interactions temps réel avec le moteur d'inférence</p>
                </div>
                <div className="tech-card">
                    <div className="tech-icon">🎨</div>
                    <h3>CSS3 Avancé</h3>
                    <p>Design glassmorphism avec animations fluides et interface responsive</p>
                </div>
                <div className="tech-card">
                    <div className="tech-icon">📊</div>
                    <h3>TOS Simulation</h3>
                    <p>Simulation du Terminal Operating System avec gestion des états</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Section Statistiques --> */}
    <section className="stats-section" id="stat">
        <div className="container">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">6</div>
                    <div className="stat-label">Modules Intégrés</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Règles Prolog</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Automatisé</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Disponibilité</div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Section Call to Action --> */}
    <section className="cta-section" id="demo">
        <div className="container">
            <h2>🎯 Testez le Système Expert</h2>
            <p>Découvrez la puissance de l'IA appliquée à la logistique portuaire</p>
            <div className="cta-buttons">
                <a href="system.html" className="cta-button primary large">
                    🚀 Lancer la Démonstration
                </a>
                <a href="#modules" className="cta-button secondary large">
                    📖 Documentation
                </a>
            </div>
        </div>
    </section>

      
    </Layout>
  );
}