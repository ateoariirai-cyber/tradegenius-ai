import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On ajoute une petite sécurité pour éviter que ça plante si les clés manquent
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("ATTENTION : Les clés Supabase ne sont pas chargées !");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
