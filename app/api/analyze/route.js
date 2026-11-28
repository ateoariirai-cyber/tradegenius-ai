// app/api/analyze/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { agentId, marketData } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ analysis: "❌ Erreur : Clé API manquante sur Vercel." });
    }

    let prompt = "";
    if (agentId === 'market_intel') {
      prompt = `Tu es le Market Intelligence Agent de TradeGenius. Analyse ces données : ${JSON.stringify(marketData)}. Rédige un rapport de 3 phrases maximum sur la tendance actuelle et la volatilité. Sois professionnel.`;
    } else if (agentId === 'tech_analyst') {
      prompt = `Tu es le Technical Analyst de TradeGenius. Voici les indicateurs : ${JSON.stringify(marketData.indicators)}. Fais une analyse technique en 3 phrases max (RSI, EMA, tendance). Sois précis.`;
    } else {
      prompt = `Analyse ces données de marché : ${JSON.stringify(marketData)}.`;
    }

    // Liste de secours : on teste les modèles un par un
    const models = [
      "qwen/qwen-2-7b-instruct:free",
      "meta-llama/llama-3-8b-instruct:free",
      "google/gemma-7b-it:free"
    ];

    let aiText = null;
    let lastError = null;

    for (const model of models) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://tradegenius-ai-lkhv.vercel.app',
            'X-Title': 'TradeGenius AI'
          },
          body: JSON.stringify({
            model: model,
            max_tokens: 150,
            messages: [{ role: "user", content: prompt }]
          })
        });

        const data = await response.json();
        
        // Si on a une réponse valide, on la garde et on arrête la boucle
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          aiText = data.choices[0].message.content;
          break; 
        } else {
          // Sinon on note l'erreur et on passe au modèle suivant
          lastError = data.error?.message || "Réponse vide";
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    // Si un modèle a répondu, on affiche le résultat
    if (aiText) {
      return NextResponse.json({ analysis: aiText });
    } else {
      // Si vraiment aucun modèle ne marche, on affiche une erreur claire
      return NextResponse.json({ analysis: `❌ L'IA est temporairement indisponible. Dernier essai : ${lastError}` });
    }

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ analysis: `❌ Erreur Serveur : ${error.message}` });
  }
}
