// components/Layout.tsx
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-200 text-gray-800">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚢 Système Expert</h1>
          <nav className="space-x-4">
            <Link href="/" className="hover:underline">Accueil</Link>
            <Link href="/documentation" className="hover:underline">Documentation</Link>
          </nav>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Système Expert - Terminal à Conteneurs. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
