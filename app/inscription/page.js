'use client';
import { useState } from 'react';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';

export default function Inscription() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [nom, setNom] = useState('');
  const [pays, setPays] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  const sInscrire = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: motDePasse
    });

    if (authError) {
      setErreur(authError.message);
    } else {
      await supabase.from('utilisateurs').insert({
        id: authData.user.id,
        email,
        nom,
        pays
      });
      router.push('/dashboard');
    }
    setChargement(false);
  };

  return (
    <div style={{maxWidth: '400px', margin: '4rem auto', padding: '2rem'}}>
      <h1>🚀 Créer un compte TradeGenius AI</h1>
      <form onSubmit={sInscrire} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required style={{padding: '0.75rem'}} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{padding: '0.75rem'}} />
        <input type="text" placeholder="Pays" value={pays} onChange={(e) => setPays(e.target.value)} style={{padding: '0.75rem'}} />
        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required style={{padding: '0.75rem'}} />
        {erreur && <p style={{color: 'red'}}>{erreur}</p>}
        <button type="submit" disabled={chargement} style={{padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem'}}>
          {chargement ? 'Création en cours...' : 'S\'inscrire'}
        </button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Déjà un compte ? <a href="/connexion" style={{color: '#2563eb'}}>Se connecter</a>
      </p>
    </div>
  );
  }
  
