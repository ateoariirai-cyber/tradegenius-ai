'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function SavedResponses() {
  const [responseList, setResponseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadResponses = async () => {
      setLoading(true);
      setErrorMsg('');
      const { data, error } = await supabase
        .from('reponses_ia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setErrorMsg('Impossible de charger les réponses');
        console.error(error);
      } else {
        setResponseList(data);
      }
      setLoading(false);
    };
    loadResponses();
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Mes réponses enregistrées</h1>
      <a href="/dashboard" style={{ color: '#2563eb' }}>← Retour au tableau de bord</a>

      {loading && <p>Chargement en cours…</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {!loading && responseList.length === 0 && (
        <p style={{ marginTop: '2rem' }}>Aucune réponse de Dola n’a encore été enregistrée</p>
      )}

      {responseList.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '1.5rem', marginTop: '1.5rem' }}>
          <p><strong>Réponse IA :</strong></p>
          <p>{item.reponse}</p>
        </div>
      ))}
    </main>
  );
        }
