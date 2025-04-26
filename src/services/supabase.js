// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
  }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const setSupabaseUserContext = async (userId) => {
  try {
    // Set the user ID in the Supabase connection context
    await supabase.rpc('set_user_context', {
      user_id: userId
    });
    return true;
  } catch (error) {
    console.error('Error setting user context:', error);
    return false;
  }
};