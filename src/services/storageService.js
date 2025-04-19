// src/services/storageService.js
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Upload an image to Supabase Storage
export const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `images/${fileName}`;
  
  const { error } = await supabase
    .storage
    .from('hobbyhub-images')
    .upload(filePath, file);
  
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  // Get public URL
  const { data } = supabase
    .storage
    .from('hobbyhub-images')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};