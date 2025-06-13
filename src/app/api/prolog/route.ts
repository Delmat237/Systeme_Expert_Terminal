import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, module } = await request.json();
    
    // Ici vous intégreriez votre moteur Prolog
    // Pour l'exemple, nous simulons une réponse
    const mockResponses: Record<string, string> = {
      base: `Résultat pour la base: ${code}`,
      planning: `Planification: ${code}`,
      yard: `Opérations de cour: ${code}`,
      customs: `Douanes: ${code}`
    };

    return NextResponse.json({ 
      result: mockResponses[module] || mockResponses.base 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de traitement' }, { status: 500 });
  }
}