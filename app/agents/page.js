'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AgentsPage() {
  const [nomAgent, setNomAgent] = useState('');
  const [typeAgent, setTypeAgent] = useState('');
  const [paireMarche, setPaireMarche] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [listeAgents, setListeAgents] = useState([]);

  const chargerAgents = async () => {
    const { data } = await supabase
      .from('agents_trading')
      .select('*')
      .order('cree_le', { ascending: false });
    setListeAgents(data || []);
  };

  const creerAgent = async (e) => {
    e.preventDefault();
    await supabase.from('agents_trading').insert([
      {
        nom_agent: nomAgent,
        type_agent: typeAgent,
        paire_marche: paireMarche,
        time_frame: timeFrame
      }
    ]);
    setNomAgent('');
    setTypeAgent('');
    setPaireMarche('');
    setTimeFrame('');
    chargerAgents();
  };

  useEffect(() => {
    chargerAgents();
  }, []);

  return (
    <main style={{ padding: '30px' }}>
      <h1>Mes Agents IA de Trading</h1>
      <form onSubmit={creerAgent}>
        <div>
          <label>Nom de l'agent</label>
          <input value={nomAgent} onChange={(e) => setNomAgent(e.target.value)} required />
        </div>
        <div>
          <label>Type d'agent</label>
          <input value={typeAgent} onChange={(e) => setTypeAgent(e.target.value)} required />
        </div>
        <div>
          <label>Paire du marché</label>
          <input value={paireMarche} onChange={(e) => setPaireMarche(e.target.value)} required />
        </div>
        <div>
          <label>Time Frame</label>
          <input value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} required />
        </div>
        <button type="submit">Créer l'agent IA</button>
      </form>

      <h2>Liste de vos agents</h2>
      {listeAgents.map((agent) => (
        <div key={agent.id}>
          <p><strong>{agent.nom_agent}</strong> | {agent.type_agent} | {agent.paire_marche} | {agent.time_frame}</p>
        </div>
      ))}
    </main>
  );
  }
  
