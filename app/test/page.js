'use client';
import { useState } from 'react';
import { orchestrateTradingCycle } from '../../lib/agents-engine';
import { calculateRiskAndLots } from '../../lib/risk-engine';

export default function TestPage() {
  const [logs, setLogs] = useState([]);
  const [riskResult, setRiskResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const lancerTest = async () => {
    setLoading(true);
    setLogs([]);
    setRiskResult(null);

    // 1. Simulation des données de marché
    const mockMarketData = { symbol: 'XAUUSD', price: 2000, trend: 'bullish' };

    // 2. On lance le cycle des agents
    const cycleResult = await orchestrateTradingCycle(mockMarketData);
    setLogs(cycleResult.logs);

    // 3. Si le signal est validé, on demande au Risk Engine de calculer
    if (cycleResult.action === 'TRADE_READY') {
      
      // Simulation d'un compte de 1000$ et d'un trade sur l'Or
      const riskParams = {
        accountBalance: 1000,
        entryPrice: 2000,
        stopLossPrice: 1995, // Stop loss à 5$ de distance
        symbolSpecs: {
          minLot: 0.01,
          lotStep: 0.01,
          tickSize: 0.01,
          tickValue: 1
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
      <p>Clique sur le bouton pour simuler un cycle de trading complet.</p>

      <button 
        onClick={lancerTest} 
        disabled={loading}
        style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', width: '100%', marginBottom: '20px' }}
      >
        {loading ? 'Analyse en cours...' : '▶️ Lancer la simulation'}
      </button>

      {logs.length > 0 && (
        <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>📡 Logs de l'Orchestrateur :</h3>
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
          {riskResult.details && <p><strong>Perte max :</strong> {riskResult.details.potentialLossUSD} USD</p>}
        </div>
      )}
    </main>
  );
        }
