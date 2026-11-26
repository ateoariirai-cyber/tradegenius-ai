'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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
        .select('*');

      console.log("DONNEES RECUES :", data);
      console.log("ERREUR COMPLETE :", error);

      if (error) {
        setErrorMsg("Impossible de charger les réponses");
        console.error("ERREUR SUPABASE :", error);
      } else {
        setResponseList(data);
      }
      setLoading(false);
    };
    loadResponses();
  }, []);

  return (
    <main style={{padding:"30px"}}>
      <h1>Mes réponses enregistrées</h1>
      <Link href="/dashboard">← Retour au tableau de bord</Link>

      {errorMsg && <p style={{color:"red"}}>{errorMsg}</p>}

      {loading ? (
        <p>Chargement en cours...</p>
      ) : responseList.length === 0 ? (
        <p>Aucune réponse de Dola n’a encore été enregistrée</p>
      ) : (
        responseList.map((item) => (
          <div key={item.id} style={{border:"1px solid #ccc", borderRadius:"12px", padding:"20px", margin:"15px 0"}}>
            <p><strong>ID avis :</strong> {item.avis_id}</p>
            <p><strong>Réponse :</strong> {item.reponse}</p>
          </div>
        ))
      )}
    </main>
  );
}
