'use client';
import { useState } from 'react';
import { orchestrateTradingCycle } from '../../lib/agents-engine';
import { calculateRiskAndLots } from '../../lib/risk-engine';
import { fetchMarketPrice } from '../../lib/data-engine';

export default function TestPage() {
  const [logs, setLogs] = useState([]);
  const [riskResult, setRiskResult] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const lancerTest = async () => {
    setLoading(true);
    setLogs([]);
    setRiskResult(null);
    setMarketData(null);

    // 1. Le Data Engine va chercher le vrai prix du BTC
    const liveData = await fetchMarketPrice('BTCUSD');
    setMarketData(liveData);

    if (liveData.status === 'ERROR') {
      setLogs(["❌ Impossible de récupérer les données du marché."]);
      setLoading(false);
      return;
    }

    // 2. On lance le cycle des agents avec les vraies données
    const cycleResult = await orchestrateTradingCycle(liveData);
    setLogs(cycleResult.logs);

    // 3. Si le signal est validé, le Risk Engine calcule
    if (cycleResult.action === 'TRADE_READY') {
      
      const riskParams = {
        accountBalance: 10000, // On met 10 000$ pour autoriser le trade cette fois
        entryPrice: liveData.price,
        stopLossPrice: liveData.price - 500, // Stop loss à 500$ en dessous (pour le BTC)
        symbolSpecs: {
          minLot: 0.01,
          lotStep: 0.01,
          tickSize: 0.1, // Le BTC bouge par 0.1$
          tickValue: 0.1
        }
      };

      const riskCalculation = calculateRiskAndLots(riskParams);
      setRiskResult(riskCalculation);
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#0070f3' }}>🧪 Test des Moteurs TradeGenius</h1>
      <p>Clique sur le bouton pour récupérer le VRAI prix du Bitcoin et simuler un trade.</p>

      <button 
        onClick={lancerTest} 
        disabled={loading}
        style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', width: '100%', marginBottom: '20px' }}
      >
        {loading ? 'Récupération des données...' : '▶️ Lancer la simulation BTC'}
      </button>

      {marketData && (
        <div style={{ background: '#e2e3e5', padding: '15px', borderRadius: '5px', marginBottom: '20px', color: '#383d41' }}>
          <h3>📡 Données du Marché ({marketData.source}) :</h3>
          <p><strong>Symbole :</strong> {marketData.symbol}</p>
          <p><strong>Prix Actuel :</strong> {marketData.price} $</p>
          <p><strong>Statut :</strong> {marketData.status}</p>
        </div>
      )}

      {logs.length > 0 && (
        <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>🧠 Logs de l'Orchestrateur :</h3>
          {logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>{"> "} {log}</div>
          ))}
        </div>
      )}

      {riskResult && (
        <div style={{ background: riskResult.approved ? '#d4edda' : '#f8d7da', color: riskResult.approved ? '#155724' : '#721c24', padding: '15px', borderRadius: '5px' }}>
          <h3>🛡️ Résultat du Risk Engine :</h3>
          <p><strong>Statut :</strong> {riskResult.approved ? '✅ TRADE AUTORISÉ' : '❌ TRADE REFUSÉ'}</p>
          <p><strong>Raison :</strong> {riskResult.reason}</p>
          {riskResult.lotSize && <p><strong>Taille du lot :</strong> {riskResult.lotSize}</p>}
        </div>
      )}
    </main>
  );
        }
