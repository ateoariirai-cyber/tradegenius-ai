'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

export default function AgentsPage() {
  const [nomAgent, setNomAgent] = useState('');
  const [typeAgent, setTypeAgent] = useState('');
  const [paireMarche, setPaireMarche] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [listeAgents, setListeAgents] = useState([]);
  const [erreur, setErreur] = useState('');

  // Utilisation de useCallback pour corriger l'erreur Vercel (dépendances)
  const chargerAgents = useCallback(async () => {
    const { data, error } = await supabase
      .from('agents_trading')
      .select('*')
      .order('cree_le', { ascending: false });
      
    if (error) {
      console.error("Erreur de chargement:", error.message);
    } else {
      setListeAgents(data || []);
    }
  }, []);

  const creerAgent = async (e) => {
    e.preventDefault();
    setErreur('');

    const { error } = await supabase.from('agents_trading').insert([
      {
        nom_agent: nomAgent,
        type_agent: typeAgent,
        paire_marche: paireMarche,
        time_frame: timeFrame
      }
    ]);

    if (error) {
      setErreur("Erreur lors de la création. Vérifie ta connexion.");
      console.error(error);
      return;
    }

    setNomAgent('');
    setTypeAgent('');
    setPaireMarche('');
    setTimeFrame('');
    chargerAgents();
  };

  useEffect(() => {
    chargerAgents();
  }, [chargerAgents]);

  return (
    <main style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Mes Agents IA de Trading</h1>
      
      {erreur && <p style={{ color: 'red', background: '#ffebee', padding: '10px' }}>{erreur}</p>}

      <form onSubmit={creerAgent} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Nom de l'agent</label>
          <input 
            value={nomAgent} 
            onChange={(e) => setNomAgent(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
            placeholder="Ex: Market Intelligence"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Type d'agent</label>
          <input 
            value={typeAgent} 
            onChange={(e) => setTypeAgent(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
            placeholder="Ex: Analyste, Risk, Exécution..."
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Paire du marché</label>
          <input 
            value={paireMarche} 
            onChange={(e) => setPaireMarche(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
            placeholder="Ex: XAUUSD"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Time Frame</label>
          <input 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
            placeholder="Ex: H1, M15..."
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Créer l'agent IA
        </button>
      </form>

      <h2>Liste de vos agents</h2>
      {listeAgents.length === 0 ? (
        <p>Aucun agent pour le moment.</p>
      ) : (
        listeAgents.map((agent) => (
          <div key={agent.id} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
            <p style={{ margin: 0 }}><strong>{agent.nom_agent}</strong></p>
            <small>{agent.type_agent} | {agent.paire_marche} | {agent.time_frame}</small>
          </div>
        ))
      )}
    </main>
  );
                        }
