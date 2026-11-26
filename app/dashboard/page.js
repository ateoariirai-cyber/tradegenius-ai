'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [avis, setAvis] = useState([
    { id: 1, texte: "Très déçu, l'attente était trop longue.", note: 2 },
  ]);
  
  const genererReponse = (texte) => {
    alert("Dola prépare une réponse adaptée à cet avis ! ✨");
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📊 Tableau de bord TradeGenius AI</h1>
      <h2>Avis clients</h2>
      
      {avis.length === 0 ? (
        <p>Aucun avis pour l'instant.</p>
      ) : (
        avis.map(a => (
          <div key={a.id} style={{ border: '1px solid #ddd', padding: '1rem', margin: '1rem 0', borderRadius: '8px' }}>
            <p>{a.texte}</p>
            <p>Note : {"⭐".repeat(a.note)}</p>
            <button 
              onClick={() => genererReponse(a.texte)}
              style={{ padding: '0.5rem 1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ✨ Générer une réponse avec Dola
            </button>
          </div>
        ))
      )}
    </main>
  );
}
