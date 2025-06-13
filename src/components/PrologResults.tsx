interface PrologResultsProps {
  results: string;
}

export default function PrologResults({ results }: PrologResultsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h2 className="font-medium">Résultats</h2>
      </div>
      <pre className="w-full h-48 p-4 overflow-auto bg-gray-50 text-sm">
        {results || 'Les résultats apparaîtront ici...'}
      </pre>
    </div>
  );
}