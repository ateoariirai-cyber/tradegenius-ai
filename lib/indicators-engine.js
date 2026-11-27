// =====================================================================
// TRADEGENIUS AI - INDICATORS ENGINE (V1)
// Calculs mathématiques purs. Aucun appel IA ici.
// =====================================================================

/**
 * Calcule l'Exponential Moving Average (EMA)
 * @param {Array} prices - Tableau de prix (clôtures)
 * @param {number} period - Période (ex: 20, 50, 200)
 */
export function calculateEMA(prices, period) {
  if (prices.length < period) return null;
  
  const k = 2 / (period + 1);
  // On initialise avec la moyenne simple (SMA) des premiers prix
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * k + ema;
  }
  return parseFloat(ema.toFixed(2));
}

/**
 * Calcule le Relative Strength Index (RSI)
 * @param {Array} prices - Tableau de prix (clôtures)
 * @param {number} period - Période (généralement 14)
 */
export function calculateRSI(prices, period = 14) {
  if (prices.length <= period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const difference = prices[i] - prices[i - 1];
    if (difference >= 0) gains += difference;
    else losses -= difference;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < prices.length; i++) {
    const difference = prices[i] - prices[i - 1];
    const gain = difference > 0 ? difference : 0;
    const loss = difference < 0 ? -difference : 0;
    
    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  return parseFloat(rsi.toFixed(2));
}

/**
 * Calcule l'Average True Range (ATR) pour la volatilité
 * @param {Array} candles - Tableau d'objets {high, low, close}
 * @param {number} period - Période (généralement 14)
 */
export function calculateATR(candles, period = 14) {
  if (candles.length <= period) return null;

  const trueRanges = [];
  for (let i = 1; i < candles.length; i++) {
    const current = candles[i];
    const previous = candles[i - 1];
    
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - previous.close),
      Math.abs(current.low - previous.close)
    );
    trueRanges.push(tr);
  }

  // Moyenne simple des True Ranges (SMA de l'ATR)
  const atr = trueRanges.slice(-period).reduce((a, b) => a + b, 0) / period;
  return parseFloat(atr.toFixed(2));
}

/**
 * Fonction principale qui calcule tous les indicateurs d'un coup
 * @param {Array} candles - Les données historiques
 */
export function calculateAllIndicators(candles) {
  if (!candles || candles.length < 200) {
    return { error: "Pas assez de données historiques (200 bougies requises)." };
  }

  const closePrices = candles.map(c => c.close);

  const ema20 = calculateEMA(closePrices, 20);
  const ema50 = calculateEMA(closePrices, 50);
  const ema200 = calculateEMA(closePrices, 200);
  const rsi14 = calculateRSI(closePrices, 14);
  const atr14 = calculateATR(candles, 14);

  // Déduction basique du régime de marché
  let trend = "RANGE";
  if (ema20 > ema50 && ema50 > ema200) trend = "BULLISH";
  if (ema20 < ema50 && ema50 < ema200) trend = "BEARISH";

  return {
    ema20,
    ema50,
    ema200,
    rsi14,
    atr14,
    trend,
    timestamp: new Date().toISOString()
  };
}
