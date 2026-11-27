// =====================================================================
// TRADEGENIUS AI - MOTEUR D'AGENTS (V2)
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

export async function runAgent(agentId, marketData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        agentId: agentId,
        status: 'SUCCESS',
        data: { analysis: "Analyse simulée terminée.", trend: "bullish" }
      });
    }, 100);
  });
}

export async function orchestrateTradingCycle(marketData) {
  const logs = [];
  logs.push("Démarrage du cycle d'analyse...");

  // --- ÉTAPE A : Les Analyses ---
  const intelReport = await runAgent(AGENTS.MARKET_INTELLIGENCE.id, marketData);
  logs.push(`[${AGENTS.MARKET_INTELLIGENCE.name}] : ${intelReport.data.analysis}`);
  
  const techReport = await runAgent(AGENTS.TECHNICAL_ANALYST.id, marketData);
  logs.push(`[${AGENTS.TECHNICAL_ANALYST.name}] : ${techReport.data.analysis}`);

  // --- ÉTAPE B : Le Signal (Vrai moteur de stratégie) ---
  // On utilise les indicateurs passés dans marketData
  const strategyResult = generateSignal(marketData.indicators);
  const signalDecision = strategyResult.signal;
  
  logs.push(`[Moteur de Stratégie] : Signal = ${signalDecision} (${strategyResult.reason})`);

  if (signalDecision === "NO_TRADE") {
    logs.push("Fin du cycle : Aucun signal valide (NO_TRADE).");
    return { action: "WAIT", logs }; 
  }

  // --- ÉTAPE C : Le Risque ---
  // (Le vrai calcul est fait par le Risk Engine dans la page de test)
  logs.push(`[Risk Engine] : En attente de validation mathématique...`);

  // --- ÉTAPE D : Exécution ---
  logs.push(`[Execution Trader] : Préparation de l'ordre pour ${signalDecision}`);
  
  return {
    action: "TRADE_READY",
    signal: signalDecision,
    logs: logs
  };
}
