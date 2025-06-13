// components/Layout.tsx
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

export default function Footer() {
  return (
    
    <div className=" bg-blue-800 text-white text-center py-4">
      {/* Footer */}
        <footer className="footer">
        <div className="container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>🚢 Port Expert AI</h3>
                    <p>Système Expert pour la Gestion Logistique d'un Terminal à Conteneurs</p>
                </div>
                <div className="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="system.html">🖥️ Système Expert</a></li>
                        <li><a href="rules.html">📚 Règles Prolog</a></li>
                        <li><a href="#modules">📋 Modules</a></li>
                        <li><a href="#process">⚙️ Processus</a></li>
                        <li><a href="#technology">🛠️ Technologies</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                                                    
                                      <h4 >Technologies Clés</h4>
                                      <ul className="space-y-2">
                                        <li>
                                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                          <span className="text-blue-100 hover:text-white transition-colors">Prolog (Moteur d'inférence)</span>
                                        </li>
                                        <li>
                                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                          <span className="text-blue-100 hover:text-white transition-colors">TypeScript/JavaScript ES6+</span>
                                        </li>
                                        <li>
                                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                          <span className="text-blue-100 hover:text-white transition-colors">Next.js (Framework React)</span>
                                        </li>
                                        <li>
                                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                          <span className="text-blue-100 hover:text-white transition-colors">Tailwind CSS (Stylage)</span>
                                        </li>
                                        <li>
                                          <span className="w-2 h-2 bg-blue-300 rounded-full mr-2"></span>
                                          <span className="text-blue-100 hover:text-white transition-colors">HTML5 (Sémantique)</span>
                                        </li>
                                      </ul>
                                    </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>École Nationale Supérieure Polytechnique de Yaoundé</p>
                    <p>Projet IA & Systeme formel - 2025</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()}   Système Expert - Terminal à Conteneurs. Tous droits réservés</p>
            </div>
        </div>
    </footer>
    </div>
  );
}
