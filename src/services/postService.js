// src/services/postService.js
import { supabase } from './supabase';
import { getCurrentUser } from './authService';

// Create a new post
export const createPost = async (postData) => {
  const userId = await getCurrentUser();
  
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title: postData.title,
        content: postData.content || null,
        image_url: postData.imageUrl || null,
        author_id: userId,
        flags: postData.flags || []
      }
    ])
    .select();
  
  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  
  return data[0];
};

// Get all posts
export const getPosts = async (sortBy = 'created_at', sortOrder = 'desc') => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order(sortBy, { ascending: sortOrder === 'asc' });
  
  if (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
  
  return data;
};

// Get a single post by ID
export const getPostById = async (postId) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();
  
  if (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
  
  return data;
};

// Update a post
export const updatePost = async (postId, postData) => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      title: postData.title,
      content: postData.content || null,
      image_url: postData.imageUrl || null,
      flags: postData.flags || [],
      updated_at: new Date()
    })
    .eq('id', postId)
    .select();
  
  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }
  
  return data[0];
};

// Delete a post
export const deletePost = async (postId) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  if (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
  
  return true;
};

// Upvote a post
export const upvotePost = async (postId) => {
  // Get the current post to get the current upvote count
  const { data: post } = await supabase
    .from('posts')
    .select('upvotes')
    .eq('id', postId)
    .single();
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Increment the upvote count
  const { data, error } = await supabase
    .from('posts')
    .update({ upvotes: post.upvotes + 1 })
    .eq('id', postId)
    .select();
  
  if (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
  
  return data[0];
};

// Search posts by title
export const searchPosts = async (query) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('title', `%${query}%`);
  
  if (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
  
  return data;
};

// Filter posts by flag
export const filterPostsByFlag = async (flag) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .contains('flags', [flag]);
  
  if (error) {
    console.error('Error filtering posts:', error);
    throw error;
  }
  
  return data;
};