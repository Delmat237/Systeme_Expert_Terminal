// components/Layout.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ReactNode } from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
      const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-200 text-gray-800">
             <Head>
                    <title>Système Expert Prolog - Terminal à Conteneurs</title>
                    <meta name="description" content="Interface pour le système expert Prolog de gestion logistique" />
                </Head>
        
             
      {/* Header */}
    
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md font-bold">
       
        <div className="max-w-6xl mx-auto flex justify-between items-center">
         <div>
           <h1 className="text-2xl font-bold">🚢 Système Expert</h1>
             <p className="text-sm">Terminal à Conteneurs - Port Autonome de Kribi</p>
        </div>
        
           {/* Sidebar navigation responsive */}
            
              <nav className={`space-y-4 space-x-4 text-left lg:text-left transition-all duration-300 ${showMenu ? 'block' : 'hidden'} lg:block`}>
                            <Link href="/" className=" hover:underline">📋  Modules</Link>
                            <Link href="/" className="  hover:underline">⚙️ Processus</Link>
                              <Link href="/" className="  hover:underline">🛠️ Technologie </Link>
                              <Link href="/" className="  hover:underline">📚 Règles Prolog </Link>
                            <Link href="/documentation" className="  hover:underline">🚀 Demonstration</Link>
                </nav>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="lg:hidden mb-4 bg-blue-600 text-white py-2 px-4 rounded  items-center justify-center gap-2"
                  >
                   
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${showMenu ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                     <span >{showMenu ? '' : ''}</span>
                  </button>
      
        </div>
      </header>

      {/* Contenu principal */}
      <main >
        {children}
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  );
}
