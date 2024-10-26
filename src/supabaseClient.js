import { createClient } from '@supabase/supabase-js';

// Pobieramy klucze środowiskowe
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Tworzymy klienta Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
