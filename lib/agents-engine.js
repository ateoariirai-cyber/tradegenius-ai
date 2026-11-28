// =====================================================================
// TRADEGENIUS AI - MOTEUR D'AGENTS (V3 - Connecté à l'IA)
// =====================================================================
import { generateSignal } from './strategy-engine';

export const ROLES = {
  ANALYST: 'ANALYST',
  SIGNAL: 'SIGNAL',
  RISK: 'RISK',
  EXECUTION: 'EXECUTION'
};

export const AGENTS = {
  MARKET_INTELLIGENCE: { id: 'market_intel', name: 'Market Intelligence', role: ROLES.ANALYST },
  TECHNICAL_ANALYST: { id: 'tech_analyst', name: 'Technical Analyst', role: ROLES.ANALYST },
  NEWS_INTELLIGENCE: { id: 'news_intel', name: 'News Intelligence', role: ROLES.ANALYST },
  REGIME_DETECTOR: { id: 'regime_detect', name: 'Market Regime Detector', role: ROLES.ANALYST },
  RISK_GUARDIAN: { id: 'risk_guardian', name: 'Risk Guardian', role: ROLES.RISK },
  EXECUTION_TRADER: { id: 'exec_trader', name: 'Execution Trader', role: ROLES.EXECUTION },
  PERFORMANCE_COACH: { id: 'perf_coach', name: 'Performance Coach', role: ROLES.ANALYST },
  SECURITY_GUARDIAN: { id: 'sec_guardian', name: 'Security Guardian', role: ROLES.ANALYST },
  QUANT_RESEARCHER: { id: 'quant_research', name: 'Quantitative Researcher', role: ROLES.ANALYST }
};

// C'est ici que la magie opère : on appelle notre API secrète
export async function runAgent(agentId, marketData) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, marketData })
    });
    
    if (!response.ok) throw new Error("Erreur réseau");

    const data = await response.json();
    
    return {
      agentId: agentId,
      status: 'SUCCESS',
      data: { analysis: data.analysis || "Analyse vide." }
    };
  } catch (error) {
    return {
      agentId: agentId,
      status: 'ERROR',
      data: { analysis: "Erreur de connexion à l'IA." }
    };
  }
}

export async function orchestrateTradingCycle(marketData) {
  const logs = [];
  logs.push("Démarrage du cycle d'analyse...");

  const intelReport = await runAgent(AGENTS.MARKET_INTELLIGENCE.id, marketData);
  logs.push(`[${AGENTS.MARKET_INTELLIGENCE.name}] : ${intelReport.data.analysis}`);
  
  const techReport = await runAgent(AGENTS.TECHNICAL_ANALYST.id, marketData);
  logs.push(`[${AGENTS.TECHNICAL_ANALYST.name}] : ${techReport.data.analysis}`);

  const strategyResult = generateSignal(marketData.indicators);
  const signalDecision = strategyResult.signal;
  
  logs.push(`[Moteur de Stratégie] : Signal = ${signalDecision} (${strategyResult.reason})`);

  if (signalDecision === "NO_TRADE") {
    logs.push("Fin du cycle : Aucun signal valide (NO_TRADE).");
    return { action: "WAIT", logs }; 
  }

  logs.push(`[Risk Engine] : En attente de validation mathématique...`);
  logs.push(`[Execution Trader] : Préparation de l'ordre pour ${signalDecision}`);
  
  return {
    action: "TRADE_READY",
    signal: signalDecision,
    logs: logs
  };
}
