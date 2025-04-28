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
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
    
    if (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Post not found');
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPostById:', error.message || error);
    throw error;
  }
};

// Update a post - simplified version
export const updatePost = async (postId, postData) => {

  const userId = await getCurrentUser();
  
  // First check if user is the author
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();
  
  if (fetchError) throw fetchError;
  if (!post) throw new Error('Post not found');
  if (post.author_id !== userId) {
    throw new Error('Unauthorized: You can only edit your own posts');
  }

  const updateData = {
    title: postData.title,
    content: postData.content || null,
    image_url: postData.imageUrl || null, // Make sure this conversion is explicit
    flags: postData.flags || [],
    updated_at: new Date().toISOString() // Use ISO string format
  };
  
  // console.log('Sending to Supabase:', updateData);
  // Perform the update
  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', postId)
    .select();
  
  if (error) {
    console.error('Error updating post:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    // If update succeeded but no data returned, fetch the post
    const { data: fetchedPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();
      
    if (fetchError) {
      throw fetchError;
    }
    
    return fetchedPost;
  }
  
  return data[0];
};

// Delete a post
export const deletePost = async (postId) => {
  const userId = await getCurrentUser();
  
  // First check if post exists and user is the author
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching post for deletion:', fetchError);
    throw fetchError;
  }
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  if (post.author_id !== userId) {
    throw new Error('Unauthorized: You can only delete your own posts');
  }
  
  // Now perform the delete
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

// Upvote a post - fixed version
export const upvotePost = async (postId) => {
  await supabase.rpc('increment_upvotes', { post_id: postId });
  
  // Fetch and return the updated post
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();
  
  return data;
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