'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function MesReponses() {
  const [listeReponses, setListeReponses] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const recupererReponses = async () => {
      setChargement(true);
      setErreur('');
      const { data, error } = await supabase
        .from('reponses_ia')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setErreur('Impossible de charger les réponses');
        console.error(error);
      } else {
        setListeReponses(data);
      }
      setChargement(false);
    };
    recupererReponses();
  }, []);

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Mes réponses enregistrées</h1>
      <a href="/dashboard" style={{color:"#2563eb"}}>← Retour au tableau de bord</a>

      {chargement && <p>Chargement en cours…</p>}
      {erreur && <p style={{color:"red"}}>{erreur}</p>}

      {!chargement && listeReponses.length === 0 && (
        <p style={{marginTop:"2rem"}}>Aucune réponse de Dola n’a encore été enregistrée</p>
      )}

      {listeReponses.map((item) => (
        <div key={item.id} style={{border:"1px solid #ddd", borderRadius:"12px", padding:"1.5rem", marginTop:"1.5rem"}}>
          <p><strong>Réponse IA :</strong></p>
          <p>{item.reponse}</p>
        </div>
      ))}
    </main>
  );
        }
        
