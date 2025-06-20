'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function RulesPage() {
  const codeRefs = useRef<{ [key: string]: HTMLPreElement | null }>({});

  const copyCode = (codeId: string) => {
    const codeElement = codeRefs.current[codeId];
    if (codeElement && codeElement.textContent) {
      navigator.clipboard.writeText(codeElement.textContent);
      alert('Code copié dans le presse-papiers !');
    }
  };

  // Data for code blocks
  const codeBlocks = {
    facts: {
      infrastructure: ` % quai(ID, longueur_max, tirant_max, disponible).
quai(q1, 350, 15, oui).
quai(q2, 250, 12.5, oui).
`,
      sts: `% Véhicules (ID, Type, Statut, Position, Capacité)
vehicule(agv01, agv, libre, quai_principal, 20).
vehicule(cam05, camion, libre, parking_nord, 30).
vehicule(chariot01, chariot, occupe, cour_a, 10).`,
      storage: `% Zones : zone_stockage(ID, Type, CapaciteRestante, ConnexionElectrique)
zone_stockage(bloc1, export, 80, non).
zone_stockage(bloc2, import, 90, non).
zone_stockage(bloc3, transbordement, 100, non).
zone_stockage(bloc4, refrigere, 50, oui).
zone_stockage(bloc5, dangereux, 60, non).`,
      equipment: `% Grues RTG : grue_rtg(Nom, Capacite, Statut)
grue_rtg(rtg1, 25, disponible).
grue_rtg(rtg2, 25, disponible).
grue_rtg(rtg3, 20, occupe).

% Véhicules internes : vehicule(Nom, Type, Statut)
vehicule(tracteur1, tracteur, disponible).
vehicule(tracteur2, tracteur, occupe).
vehicule(agv1, agv, disponible).
vehicule(agv2, agv, disponible).`
    },
    module1: {
      r1: `% Un quai est compatible si sa longueur et son tirant d'eau sont suffisants
quai_compatible(Navire, Quai) :-
  navire(Navire, LongueurNavire, TirantNavire, _, _, _),
  quai(Quai, LongueurQuai, TirantQuai),
  LongueurQuai >= LongueurNavire,
  TirantQuai >= TirantNavire,
  \+ occupe(Quai, _).`,
      r2: `% Vérifier si le navire peut accoster (météo OK)
peut_accoster(Navire, Vent) :-
  Vent < 50,
  write('Le navire '), write(Navire), write(' peut accoster.'), nl.

% Report d'accostage en cas de météo défavorable
reporter_accostage(Navire) :-
  meteo(Navire, defavorable),
  write('Accostage reporté pour '), write(Navire), write(' (météo défavorable).'), nl.`,
      r3: `% Vérifier la priorité basée sur les EVP
priorite_navire(Navire1, Navire2) :-
  navire(Navire1, _, _, EVP1, _, _),
  navire(Navire2, _, _, EVP2, _, _),
  EVP1 > EVP2,
  write(Navire1), write(' a la priorité sur '), write(Navire2), write('.'), nl.`,
      r4: `% Réserver un bloc de stockage pour conteneurs réfrigérés
reserver_stockage_refrigere(Navire) :-
  navire(Navire, _, _, _, PourcentRefrigeres, _),
  PourcentRefrigeres > 0,
  stockage(bloc_refrigere, disponible),
  write('Bloc réfrigéré réservé pour '), write(Navire), write('.'), nl.

% Réserver un bloc pour marchandises dangereuses
reserver_stockage_dangereux(Navire) :-
  navire(Navire, _, _, _, _, PourcentDangereux),
  PourcentDangereux > 0,
  stockage(bloc_dangereux, disponible),
  write('Bloc dangereux réservé pour '), write(Navire), write('.'), nl.`,
      main: `% Planifier l'accostage complet
planifier_accostage(Navire, Vent) :-
  peut_accoster(Navire, Vent),
  quai_compatible(Navire, Quai),
  (Quai \= aucun ->
      (reserver_stockage_refrigere(Navire),
       reserver_stockage_dangereux(Navire),
       notifier_douanes(Navire),
       write('Attribution : '), write(Navire), write(' au '), write(Quai), write('.'), nl)
  ;   true).`
    },
    // Additional modules would go here...
  };

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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
            <h1>📚 Base de Connaissances Prolog</h1>
            <h2>Règles et Faits du Système Expert</h2>
            <p className="subtitle">
                Documentation complète des 6 modules avec toutes les règles d'inférence
            </p>
            <p className="description">
                Explorez la logique métier derrière chaque opération portuaire, des règles d'accostage aux procédures douanières.
            </p>
            <div className="hero-buttons">
                <Link href="/demo" className="cta-button primary">
                    🚀 Tester le Système
                </Link>
                <Link href="#facts" className="cta-button secondary">
                    💾 Voir les Faits
                </Link>
            </div>
        </div>
      </section>

      {/* Navigation des modules */}
      <section className="modules-section" id="modules">
        <div className="container">
          <h2>🧭 Navigation Rapide</h2>
          <p className="section-subtitle">Accédez directement à chaque section de documentation</p>
          
          <div className="modules-grid">
            <Link href="#facts" className="module-card">
              <div className="module-icon">💾</div>
              <h3>Faits du Port</h3>
              <p>Infrastructure et ressources portuaires</p>
            </Link>
            
            <Link href="#module1" className="module-card">
              <div className="module-icon">⚓</div>
              <h3>Module 1 - Accostage</h3>
              <p>Planification et attribution des quais</p>
            </Link>
            
            <Link href="#module2" className="module-card">
              <div className="module-icon">🏗️</div>
              <h3>Module 2 - Déchargement</h3>
              <p>Portiques STS et transport cour</p>
            </Link>
            
            <Link href="#module3" className="module-card">
              <div className="module-icon">📦</div>
              <h3>Module 3 - Cour</h3>
              <p>Empilage et stockage intelligents</p>
            </Link>
            
            <Link href="#module4" className="module-card">
              <div className="module-icon">🛂</div>
              <h3>Module 4 - Douane</h3>
              <p>Formalités et contrôles douaniers</p>
            </Link>
            
            <Link href="#module5" className="module-card">
              <div className="module-icon">🚛</div>
              <h3>Module 5 - Chargement</h3>
              <p>Préparation export et chargement</p>
            </Link>
            
            <Link href="#module6" className="module-card">
              <div className="module-icon">🚪</div>
              <h3>Module 6 - Sortie</h3>
              <p>Transport terrestre et contrôles</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Faits du Port */}
      <section className="rules-section" id="facts">
        <div className="container">
          <h2>💾 Faits du Port</h2>
          <p className="section-subtitle">
            Infrastructure et ressources du Port Autonome de Kribi
          </p>
          
          <div className="rules-grid">
            <div className="rule-card">
              <h3>🏗️ Infrastructure Portuaire</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Quais disponibles</span>
                  <button onClick={() => copyCode('facts-infrastructure')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['facts-infrastructure'] = el}>
                  <code>{codeBlocks.facts.infrastructure}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>⚡ Vehicules disponible</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Portiques disponibles</span>
                  <button onClick={() => copyCode('facts-sts')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['facts-sts'] = el}>
                  <code>{codeBlocks.facts.sts}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>📦 Zones de Stockage</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Configuration des zones</span>
                  <button onClick={() => copyCode('facts-storage')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['facts-storage'] = el}>
                  <code>{codeBlocks.facts.storage}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>🏗️ Équipements</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Grues et véhicules</span>
                  <button onClick={() => copyCode('facts-equipment')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['facts-equipment'] = el}>
                  <code>{codeBlocks.facts.equipment}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 1 - Accostage */}
      <section className="rules-section" id="module1">
        <div className="container">
          <h2>⚓ Module 1 - Accostage</h2>
          <p className="section-subtitle">
            Planification et attribution des quais selon les contraintes physiques et météorologiques
          </p>
          
          <div className="rules-grid">
            <div className="rule-card">
              <h3>R1 : Compatibilité Quai</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Vérification des contraintes physiques</span>
                  <button onClick={() => copyCode('module1-r1')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['module1-r1'] = el}>
                  <code>{codeBlocks.module1.r1}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>R2 : Conditions Météorologiques</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Gestion des conditions climatiques</span>
                  <button onClick={() => copyCode('module1-r2')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['module1-r2'] = el}>
                  <code>{codeBlocks.module1.r2}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>R3 : Priorité des Navires</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Hiérarchisation des opérations</span>
                  <button onClick={() => copyCode('module1-r3')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['module1-r3'] = el}>
                  <code>{codeBlocks.module1.r3}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card">
              <h3>R4 : Réservation Stockage</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Gestion des zones spécialisées</span>
                  <button onClick={() => copyCode('module1-r4')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['module1-r4'] = el}>
                  <code >{codeBlocks.module1.r4}</code>
                </pre>
              </div>
            </div>
            
            <div className="rule-card full-width secondary" >
              <h3>Planification d'Accostage</h3>
              <div className="code-block">
                <div className="code-header">
                  <span>Règle principale</span>
                  <button onClick={() => copyCode('module1-main')} className="copy-btn">
                    📋 Copier
                  </button>
                </div>
                <pre ref={el => codeRefs.current['module1-main'] = el}>
                  <code>{codeBlocks.module1.main}</code>
                </pre>
              </div>
            </div>
          </div>
             <div className="container">
              <h2>🏗️ Module 2 -Déchargement STS (Ship-to-Shore)</h2>
              <p className="section-subtitle">
                Planification et attribution des quais selon les contraintes physiques et météorologiques
              </p>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="stats-section" id="stat">
        <div className="container">
          <h2>📊 Statistiques de la Base de Connaissances</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">6</div>
              <div className="stat-label">Modules Prolog</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Règles d'Inférence</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">25+</div>
              <div className="stat-label">Faits du Port</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Coverage Logistique</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Call to Action */}
      <section className="cta-section" id="demo">
        <div className="container">
          <h2>🎯 Prêt à explorer le système ?</h2>
          <p>Testez les règles Prolog en temps réel avec notre simulateur</p>
          <div className="cta-buttons">
            <Link href="/demo" className="cta-button primary large">
              🚀 Lancer la Démonstration
            </Link>
            <Link href="#modules" className="cta-button secondary large">
              📖 Continuer la Lecture
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}