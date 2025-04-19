// src/services/commentService.js
import { supabase } from './supabase';
import { getCurrentUser } from './authService';

// Create a new comment
export const createComment = async (postId, content) => {
  const userId = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        post_id: postId,
        content,
        author_id: userId
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
  
  return data[0];
};

// Get comments for a post
export const getPostComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  
  return data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
  
  return true;
};