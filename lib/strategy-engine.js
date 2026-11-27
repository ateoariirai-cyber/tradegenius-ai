// =====================================================================
// TRADEGENIUS AI - STRATEGY ENGINE (V1)
// Ce moteur applique des règles strictes basées sur les indicateurs.
// =====================================================================

/**
 * Génère un signal de trading basé sur les indicateurs techniques.
 * @param {Object} indicators - Les résultats du Indicators Engine
 * @returns {Object} { signal: 'BUY' | 'SELL' | 'NO_TRADE', reason: string }
 */
export function generateSignal(indicators) {
  if (!indicators || indicators.error) {
    return { signal: 'NO_TRADE', reason: 'Indicateurs indisponibles ou invalides.' };
  }

  const { trend, rsi14 } = indicators;

  // RÈGLE 1 : Tendance haussière + RSI pas en surachat (max 70)
  if (trend === 'BULLISH' && rsi14 < 70) {
    return { 
      signal: 'BUY', 
      reason: `Tendance haussière confirmée (RSI: ${rsi14}).` 
    };
  }

  // RÈGLE 2 : Tendance baissière + RSI pas en survente (min 30)
  if (trend === 'BEARISH' && rsi14 > 30) {
    return { 
      signal: 'SELL', 
      reason: `Tendance baissière confirmée (RSI: ${rsi14}).` 
    };
  }

  // RÈGLE 3 : Si on est en RANGE ou que le RSI est extrême, on ne trade pas
  if (trend === 'RANGE') {
    return { 
      signal: 'NO_TRADE', 
      reason: 'Marché en range (sans direction claire).' 
    };
  }

  // RÈGLE 4 : RSI en zone extrême (Surachat/Survente)
  if (rsi14 >= 70) {
    return { signal: 'NO_TRADE', reason: 'RSI en zone de surachat (risque de correction).' };
  }
  if (rsi14 <= 30) {
    return { signal: 'NO_TRADE', reason: 'RSI en zone de survente (risque de rebond).' };
  }

  // Par défaut, on ne fait rien
  return { signal: 'NO_TRADE', reason: 'Aucune condition de trading remplie.' };
}
