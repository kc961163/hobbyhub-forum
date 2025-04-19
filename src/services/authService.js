// src/services/authService.js
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// Generate a random user ID
export const generateUserId = () => {
  return uuidv4();
};

// Store user ID in local storage
export const storeUser = async (userId) => {
  localStorage.setItem('userId', userId);
  
  // Check if user already exists in preferences table
  const { data } = await supabase
    .from('user_preferences')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  // If user doesn't exist, create a new entry
  if (!data) {
    await supabase
      .from('user_preferences')
      .insert([
        { 
          user_id: userId,
          secret_key: generateSecretKey()
        }
      ]);
  }
  
  return userId;
};

// Get user ID from local storage
export const getCurrentUser = async () => {
  let userId = localStorage.getItem('userId');
  
  // If no user ID exists, create one and store it
  if (!userId) {
    userId = generateUserId();
    await storeUser(userId);
  }
  
  return userId;
};

// Generate a secret key for post ownership
export const generateSecretKey = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Get user preferences
export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
  
  return data;
};