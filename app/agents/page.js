'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function AgentsPage() {
  const [agentsList, setAgentsList] = useState([]);
  const [nomAgent, setNomAgent] = useState('');
  const [typeAgent, setTypeAgent] = useState('');
  const [paireMarche, setPaireMarche] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  useEffect(() => {
    recupererAgents();
  }, []);

  const recupererAgents = async () => {
    const { data } = await supabase.from('agents_ia').select('*');
    setAgentsList(data);
  };

  const creerAgent = async (e) => {
    e.preventDefault();
    await supabase.from('agents_ia').insert({
      nom_agent: nomAgent,
      type_agent: typeAgent,
      paire_marche: paireMarche,
      time_frame: timeFrame
    });
    setNomAgent('');
    setTypeAgent('');
    setPaireMarche('');
    setTimeFrame('');
    recupererAgents();
  };

  return (
    <main style={{padding:"30px"}}>
      <h1>Mes Agents IA de Trading</h1>
      <form onSubmit={creerAgent}>
        <div>
          <label>Nom de l'agent</label>
          <input value={nomAgent} onChange={(e)=>setNomAgent(e.target.value)} required />
        </div>
        <div>
          <label>Type d'agent</label>
          <input value={typeAgent} onChange={(e)=>setTypeAgent(e.target.value)} required />
        </div>
        <div>
          <label>Paire du marché</label>
          <input value={paireMarche} onChange={(e)=>setPaireMarche(e.target.value)} required />
        </div>
        <div>
          <label>Time Frame</label>
          <input value={timeFrame} onChange={(e)=>setTimeFrame(e.target.value)} required />
        </div>
        <button type="submit">Créer l'agent IA</button>
      </form>
      <h2>Liste de vos agents</h2>
      {agentsList?.map((agent) => (
        <div key={agent.id} style={{border:"1px solid #333", padding:"15px", margin:"10px 0"}}>
          <h3>{agent.nom_agent}</h3>
          <p>Type : {agent.type_agent}</p>
          <p>Paire : {agent.paire_marche}</p>
          <p>Time Frame : {agent.time_frame}</p>
        </div>
      ))}
    </main>
  );
  }
  
