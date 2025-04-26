// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Loading from '../components/ui/Loading';
import { getPosts } from '../services/postService';
import { supabase } from '../services/supabase';


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('count');
        if (error) throw error;
        console.log('Supabase connection successful:', data);
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    };
    
    testSupabaseConnection();
  }, []);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to HobbyHub</h1>
        <Link 
          to="/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create Post
        </Link>
      </div>
      
      {loading && (
        <div className="flex justify-center py-10">
          <Loading size="large" />
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h2 className="text-xl text-gray-600 mb-4">No posts yet!</h2>
          <p className="text-gray-500 mb-6">Be the first to create a post in our community.</p>
          <Link 
            to="/create" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create First Post
          </Link>
        </div>
      )}
      
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;