import { useState } from 'react';

interface PrologEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
}

export default function PrologEditor({ code, onChange, onExecute }: PrologEditorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <h2 className="font-medium">Éditeur Prolog</h2>
        <button 
          onClick={onExecute}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Exécuter
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 p-4 font-mono text-sm focus:outline-none"
        placeholder="Entrez votre code Prolog ici..."
      />
    </div>
  );
}