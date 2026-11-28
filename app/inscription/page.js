  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('⏳ Connexion à Supabase...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        setMessage(`❌ Erreur Supabase : ${error.message}`);
      } else {
        setMessage('✅ Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setMessage(`❌ Erreur critique : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
