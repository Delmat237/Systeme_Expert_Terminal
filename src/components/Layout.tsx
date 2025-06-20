// components/Layout.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReactNode } from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effet pour détecter le défilement de la page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      <Head>
        <title>Système Expert Prolog - Terminal à Conteneurs</title>
        <meta name="description" content="Interface pour le système expert Prolog de gestion logistique" />
      </Head>
      
      {/* Header amélioré */}
      <header className={`fixed w-full z-50 py-3 px-4 shadow-md transition-all duration-300 ${
        scrolled ? 'bg-blue-800 text-white shadow-lg' : 'bg-blue-700 text-white'
      }`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">🚢 Système Expert Prolog</h1>
              <p className="text-xs md:text-sm opacity-90">Port Autonome de Kribi</p>
            </div>
          </div>
          
          {/* Navigation desktop */}
          <nav className="hidden lg:flex space-x-6">
            {[
              { href: "/", label: "📋 Modules" },
              { href: "/process", label: "⚙️ Processus" },
              { href: "/tech", label: "🛠️ Technologie" },
              { href: "/rules", label: "📚 Règles Prolog" },
              { href: "/demo", label: "🚀 Démonstration" }
            ].map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="hover:text-blue-300 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Bouton menu mobile */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="lg:hidden bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-md transition-all"
            title={showMenu ? "Fermer le menu" : "Ouvrir le menu"}
            aria-label={showMenu ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {showMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Menu mobile */}
        {showMenu && (
          <div className="lg:hidden mt-4 bg-blue-800 rounded-lg shadow-xl p-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              {[
                { href: "/", label: "📋 Modules" },
                { href: "/process", label: "⚙️ Processus" },
                { href: "/tech", label: "🛠️ Technologie" },
                { href: "/rules", label: "📚 Règles Prolog" },
                { href: "/demo", label: "🚀 Démonstration" }
              ].map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="py-2 px-4 hover:bg-blue-700 rounded-md transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Contenu principal */}
<main className="flex items-center justify-center px-4">
  <div className="max-w-8xl w-full">
    {children}
  </div>
</main>



      {/* Footer */}
      <Footer />
      
      {/* Style global pour l'animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}