import { createClient } from '@supabase/supabase-js';

// ⚠️ REMPLACE CES DEUX LIGNES PAR TES VRAIES CLÉS
const supabaseUrl = "https://dfpueqgpiwuahfcheqxn.supabase.co";
const supabaseAnonKey = "COLLE_ICI_TA_CLE_PUBLISHABLE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
