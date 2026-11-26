export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        TradeGenius AI 🚀
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '2rem' }}>
        L'assistant intelligent pour votre commerce
      </p>
      <div style={{ 
        background: 'rgba(255,255,255,0.05)',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p>Bienvenue sur TradeGenius AI !</p>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Prochainement : analyse des avis, réponses IA et tableau de bord personnalisé
        </p>
      </div>
    </main>
  );
}
