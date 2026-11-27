// =====================================================================
// TRADEGENIUS AI - RISK ENGINE (V1)
// Ce moteur est 100% mathématique. Il ne demande pas l'avis de l'IA.
// Il applique strictement les règles de sécurité du projet.
// =====================================================================

// Paramètres de risque par défaut (ceux de ton document)
export const RISK_SETTINGS = {
  MAX_RISK_PER_TRADE_PERCENT: 0.25, // 0.25%
  REQUIRE_STOP_LOSS: true,
  MAX_DAILY_DRAWDOWN_PERCENT: 0.75,
};

/**
 * Calcule la taille de la position et vérifie si le trade est autorisé.
 */
export function calculateRiskAndLots(params) {
  const { 
    accountBalance, 
    entryPrice, 
    stopLossPrice, 
    symbolSpecs 
  } = params;

  // Valeurs par défaut au cas où le broker ne fournit pas les infos (ex: XAUUSD)
  const minLot = symbolSpecs.minLot || 0.01;
  const lotStep = symbolSpecs.lotStep || 0.01;
  const tickSize = symbolSpecs.tickSize || 0.01; 
  const tickValue = symbolSpecs.tickValue || 1; // Valeur d'un tick

  // --- 1. VÉRIFICATIONS CRITIQUES (NO TRADE si échec) ---
  if (!entryPrice || !stopLossPrice) {
    return { approved: false, reason: "Prix d'entrée ou Stop-Loss manquant." };
  }

  if (RISK_SETTINGS.REQUIRE_STOP_LOSS && entryPrice === stopLossPrice) {
    return { approved: false, reason: "Stop-Loss obligatoire et ne peut pas être égal au prix d'entrée." };
  }

  // --- 2. CALCUL DU RISQUE THÉORIQUE ---
  const riskAmountUSD = accountBalance * (RISK_SETTINGS.MAX_RISK_PER_TRADE_PERCENT / 100);
  const distanceToSL = Math.abs(entryPrice - stopLossPrice);
  
  // Calcul de la valeur du risque par lot (en fonction du symbole)
  const valuePerTick = tickValue / tickSize;
  const riskPerLot = distanceToSL * valuePerTick;

  if (riskPerLot <= 0) {
    return { approved: false, reason: "Configuration du symbole invalide (risque par lot = 0)." };
  }

  // --- 3. CALCUL DE LA TAILLE DE POSITION ---
  // Combien de lots pour risquer exactement le montant autorisé ?
  let rawLotSize = riskAmountUSD / riskPerLot;

  // On arrondit TOUJOURS vers le bas pour ne jamais dépasser le risque max
  let finalLotSize = Math.floor(rawLotSize / lotStep) * lotStep;

  // --- 4. VÉRIFICATION DU LOT MINIMUM DU BROKER ---
  // Si le lot calculé est plus petit que le lot minimum, on REFUSE le trade.
  // On n'arrondit JAMAIS vers le haut pour forcer un trade.
  if (finalLotSize < minLot) {
    return { 
      approved: false, 
      reason: `Lot minimum (${minLot}) trop grand pour le risque autorisé (${riskAmountUSD.toFixed(2)} USD).`,
      details: { riskAmountUSD, rawLotSize, minLot }
    };
  }

  // On arrondit à 2 décimales pour éviter les erreurs de flottants (ex: 0.010000001)
  finalLotSize = Math.round(finalLotSize * 100) / 100;

  // --- 5. AUTORISATION DU TRADE ---
  return {
    approved: true,
    lotSize: finalLotSize,
    riskAmountUSD: riskAmountUSD.toFixed(2),
    reason: "Trade validé par le Risk Engine.",
    details: {
      distanceToSL,
      riskPerLot: riskPerLot.toFixed(2),
      potentialLossUSD: (finalLotSize * riskPerLot).toFixed(2)
    }
  };
}
