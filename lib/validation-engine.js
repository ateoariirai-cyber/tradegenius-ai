// =====================================================================
// TRADEGENIUS AI - VALIDATION ENGINE (V1)
// Le portier final. Vérifie la fraîcheur des données et les conditions.
// =====================================================================

export function validateTrade(marketData, cycleResult, indicators) {
  
  // 1. Vérifier que les données du marché sont fraîches (moins de 5 min)
  if (!marketData || !marketData.timestamp) {
    return { valid: false, reason: "Données de marché manquantes." };
  }

  const dataAgeMs = Date.now() - new Date(marketData.timestamp).getTime();
  const maxAgeMs = 5 * 60 * 1000; // 5 minutes

  if (dataAgeMs > maxAgeMs) {
    return { valid: false, reason: "Données trop anciennes (Data Stale). NO TRADE." };
  }

  // 2. Vérifier que l'IA n'a pas renvoyé une erreur
  if (cycleResult.action !== "TRADE_READY") {
    return { valid: false, reason: "Le cycle n'a pas généré de signal valide." };
  }

  // 3. Vérifier la cohérence des indicateurs
  if (!indicators || indicators.error) {
    return { valid: false, reason: "Indicateurs techniques indisponibles ou invalides." };
  }

  // 4. Vérification de sécurité : Spread (simulé pour l'instant)
  // Dans la réalité, on comparerait le prix Ask et Bid du broker
  const spreadSimule = 0.5; // 0.5$ de spread
  const spreadMaxAutorise = 2.0; // Max 2$ autorisé

  if (spreadSimule > spreadMaxAutorise) {
    return { valid: false, reason: `Spread anormal (${spreadSimule}$). NO TRADE.` };
  }

  // 5. Si toutes les conditions sont remplies :
  return { 
    valid: true, 
    reason: "Toutes les conditions de sécurité sont remplies." 
  };
}
