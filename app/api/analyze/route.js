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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://tradegenius-ai-lkhv.vercel.app',
        'X-Title': 'TradeGenius AI'
      },
      body: JSON.stringify({
        model: "openrouter/free", // Routeur vers un modèle gratuit disponible
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return NextResponse.json({ analysis: `❌ Erreur OpenRouter : ${data.error.message}` });
    }

    const aiText = data.choices?.[0]?.message?.content || "❌ Analyse vide (Réponse vide de l'IA).";

    return NextResponse.json({ analysis: aiText });

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ analysis: `❌ Erreur Serveur : ${error.message}` });
  }
}
