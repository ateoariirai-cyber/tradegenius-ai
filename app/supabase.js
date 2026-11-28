import { createClient } from '@supabase/supabase-js';

// ⚠️ REMPLACE CES DEUX LIGNES PAR TES VRAIES CLÉS SUPABASE
const supabaseUrl = "https://TON_URL_SUPABASE.supabase.co";
const supabaseAnonKey = "TA_CLE_PUBLISHABLE_SUPABASE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
