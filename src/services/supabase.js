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
    const { error } = await supabase.rpc('set_user_context', {
      user_id: userId
    });
    
    if (error) {
      console.error('Error setting user context:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception setting user context:', error);
    return false;
  }
};