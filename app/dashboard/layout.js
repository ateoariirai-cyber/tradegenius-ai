'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifierUtilisateur = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/connexion');
      } else {
        setUtilisateur(session.user);
      }
      setChargement(false);
    };
    verifierUtilisateur();
  }, [router]);

  if (chargement) return <p style={{textAlign: 'center', padding: '2rem'}}>Chargement...</p>;

  return <>{children}</>;
}
