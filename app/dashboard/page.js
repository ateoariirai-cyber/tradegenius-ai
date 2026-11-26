'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const [avisList, setAvisList] = useState([]);
  const [reponseIA, setReponseIA] = useState('');
  const [avisSelectionne, setAvisSelectionne] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    recupererAvis();
  }, []);

  const recupererAvis = async () => {
    const { data, error } = await supabase.from('avis').select('*');
    if (!error) setAvisList(data || []);
  };

  const genererReponse = (texteAvis, avis) => {
    setChargement(true);
    setAvisSelectionne(avis);
    
    setTimeout(() => {
      let reponse = '';
      if (texteAvis.toLowerCase().includes('déçu') || texteAvis.toLowerCase().includes('déçue')) {
        reponse = "Bonjour, nous vous remercions sincèrement pour votre retour. Nous sommes vivement désolés de l'expérience que vous avez eue ; ce n'est pas le niveau de service que nous souhaitons offrir. Nous prenons votre remarque très au sérieux et mettons tout en œuvre pour nous améliorer. Au plaisir de vous retrouver très bientôt.";
      } else if (texteAvis.toLowerCase().includes('attente')) {
        reponse = "Nous vous prions de nous excuser pour cette attente trop longue. Nous travaillons actuellement à optimiser notre organisation pour que cela ne se reproduise pas. Merci de votre patience et de votre compréhension.";
      } else {
        reponse = "Merci infiniment pour votre visite et pour votre retour. Nous sommes ravis de vous avoir accueilli et espérons vous revoir très prochainement !";
      }
      setReponseIA(reponse);
      setChargement(false);
    }, 800);
  };

  const enregistrerReponse = async () => {
    if (!reponseIA || !avisSelectionne) return;
    
    const { error } = await supabase.from('reponses_ia').insert({
      avis_id: avisSelectionne.id,
      reponse: reponseIA,
      cree_le: new Date().toISOString()
    });
    
    if (error) {
      setMessage("⚠️ Erreur : " + error.message);
    } else {
      setMessage("✅ Réponse enregistrée avec succès !");
    }
    
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a1a' }}>📊 Tableau de bord ReputEasy</h1>
      <h2 style={{ fontSize: '1.3rem', color: '#444', marginTop: '2rem' }}>Avis clients</h2>
      
      {message && (
        <div style={{ 
          padding: '0.8rem', 
          marginBottom: '1rem', 
          borderRadius: '8px',
          backgroundColor: message.includes('✅') ? '#f0fdf4' : '#fef2f2',
          color: message.includes('✅') ? '#166534' : '#991b1b'
        }}>
          {message}
        </div>
      )}
      
      {avisList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', marginTop: '3rem' }}>Aucun avis pour l'instant.</p>
      ) : (
        avisList.map((avis) => (
          <div key={avis.id} style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <p style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{avis.texte}</p>
            <p style={{ color: '#f59e0b', margin: '0 0 1rem 0' }}>
              Note : {'⭐'.repeat(avis.note)}
            </p>
            
            <button
              onClick={() => genererReponse(avis.texte, avis)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.7rem 1.2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              disabled={chargement && avisSelectionne?.id === avis.id}
            >
              {chargement && avisSelectionne?.id === avis.id 
                ? '✨ Dola réfléchit...' 
                : '✨ Générer une réponse avec Dola'}
            </button>
            
            {avisSelectionne?.id === avis.id && reponseIA && (
              <div style={{ marginTop: '1.2rem', padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#1e40af' }}>💬 Réponse de Dola :</p>
                <p style={{ margin: '0 0 1rem 0', lineHeight: '1.6' }}>{reponseIA}</p>
                <button
                  onClick={enregistrerReponse}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  💾 Enregistrer la réponse
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
        }
        
