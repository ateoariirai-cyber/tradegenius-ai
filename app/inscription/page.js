'use client';
import { useState } from 'react';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InscriptionPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`❌ Erreur : ${error.message}`);
    } else {
      setMessage('✅ Compte créé avec succès ! Redirection...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#111827' }}>Créer un compte</h1>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>Rejoignez TradeGenius AI</p>

      {message && (
        <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '5px', backgroundColor: message.includes('❌') ? '#fef2f2' : '#ecfdf5', color: message.includes('❌') ? '#991b1b' : '#065f46', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleInscription} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mot de passe</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            placeholder="Minimum 6 caractères"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
        >
          {loading ? 'Création en cours...' : "S'inscrire"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        Déjà un compte ? <Link href="/connexion" style={{ color: '#2563eb', textDecoration: 'none' }}>Se connecter</Link>
      </p>
    </main>
  );
}
