'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function SignauxPage() {
  const [signauxList, setSignauxList] = useState([]);

  useEffect(() => {
    recupererSignaux();
  }, []);

  const recupererSignaux = async () => {
    const { data } = await supabase
      .from('signaux_marche')
      .select('*, agents_ia(nom_agent)')
      .order('cree_le', { ascending: false });
    setSignauxList(data);
  };

  return (
    <main style={{padding:"30px"}}>
      <h1>Signaux du marché TradeGenius AI</h1>
      {signauxList?.length === 0 ? (
        <p>Aucun signal n'a encore été généré par vos agents IA</p>
      ) : (
        signauxList.map((signal) => (
          <div key={signal.id} style={{border:"1px solid #333", padding:"15px", margin:"10px 0"}}>
            <h3>Agent : {signal.agents_ia?.nom_agent}</h3>
            <p>Type de signal : {signal.type_signal}</p>
            <p>Prix entrée : {signal.prix_entree}</p>
            <p>Stop Loss : {signal.stop_loss}</p>
            <p>Take Profit : {signal.take_profit}</p>
            <p>Commentaire IA : {signal.commentaire_ia}</p>
          </div>
        ))
      )}
    </main>
  );
}
