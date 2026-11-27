// =====================================================================
// TRADEGENIUS AI - DATA ENGINE (V1)
// Récupère les prix du marché. Utilise Binance pour le BTC (gratuit).
// Simule l'Or pour l'instant (en attendant une API gratuite fiable).
// =====================================================================

/**
 * Récupère le prix actuel d'un symbole.
 * @param {string} symbol - 'BTCUSD' ou 'XAUUSD'
 * @returns {Object} { symbol, price, timestamp, source, status }
 */
export async function fetchMarketPrice(symbol) {
  const timestamp = new Date().toISOString();

  try {
    if (symbol === 'BTCUSD') {
      // API publique de Binance (aucune clé requise)
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      if (!response.ok) throw new Error("Erreur réseau Binance");
      
      const data = await response.json();
      return {
        symbol: 'BTCUSD',
        price: parseFloat(data.price),
        timestamp: timestamp,
        source: 'Binance API',
        status: 'LIVE'
      };
    } 
    
    if (symbol === 'XAUUSD') {
      // Simulation pour l'Or (prix autour de 2300$ en 2024)
      // On ajoute une petite variation aléatoire pour faire "vivant"
      const basePrice = 2350; 
      const variation = (Math.random() - 0.5) * 5; // +/- 2.5$
      
      return {
        symbol: 'XAUUSD',
        price: parseFloat((basePrice + variation).toFixed(2)),
        timestamp: timestamp,
        source: 'Simulateur Interne',
        status: 'SIMULATED'
      };
    }

    throw new Error("Symbole non supporté");

  } catch (error) {
    console.error("Data Engine Error:", error);
    return {
      symbol: symbol,
      price: null,
      timestamp: timestamp,
      source: 'N/A',
      status: 'ERROR',
      error: error.message
    };
  }
}

/**
 * Simule la récupération de données historiques (pour les indicateurs)
 */
export function fetchHistoricalData(symbol, timeframe = '1h', limit = 100) {
  // Dans la V2, on fera un vrai appel API.
  // Pour l'instant, on génère de fausses bougies pour tester.
  const data = [];
  let price = symbol === 'BTCUSD' ? 65000 : 2350;
  
  for (let i = 0; i < limit; i++) {
    const change = (Math.random() - 0.5) * (price * 0.01); // 1% de volatilité
    price += change;
    data.push({
      time: new Date(Date.now() - (limit - i) * 3600000).toISOString(),
      open: price,
      high: price + Math.random() * 10,
      low: price - Math.random() * 10,
      close: price + (Math.random() - 0.5) * 5,
      volume: Math.random() * 1000
    });
  }
  return data;
}
