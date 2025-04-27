// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, searchPosts, filterPostsByFlag } from '../services/postService';
import Button from '../components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import PostCard from '../components/PostCard';
import Loading from '../components/ui/Loading';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [sortBy, sortOrder, activeFilter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let fetchedPosts;
      
      if (activeFilter) {
        fetchedPosts = await filterPostsByFlag(activeFilter);
      } else {
        fetchedPosts = await getPosts(sortBy, sortOrder);
      }
      
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchPosts(searchQuery);
      setPosts(results);
    } catch (err) {
      console.error('Error searching posts:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending when changing sort field
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (filter) => {
    if (activeFilter === filter) {
      // Clear filter if clicking the active one
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to HobbyHub</h1>
        <Link to="/create">
          <Button>Create Post</Button>
        </Link>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title..."
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
          />
          <Button type="submit" size="medium">Search</Button>
          {searchQuery && (
            <Button type="button" variant="secondary" size="medium" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </form>
      </div>

      <div className="mb-4 flex gap-3">
        <div>
          <span className="text-sm text-gray-600 mr-2">Sort by:</span>
          <Button 
            variant={sortBy === 'created_at' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleSortChange('created_at')}
          >
            Date {sortBy === 'created_at' && (sortOrder === 'desc' ? '↓' : '↑')}
          </Button>
          <Button 
            variant={sortBy === 'upvotes' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleSortChange('upvotes')}
            className="ml-2"
          >
            Upvotes {sortBy === 'upvotes' && (sortOrder === 'desc' ? '↓' : '↑')}
          </Button>
        </div>

        <div className="ml-4">
          <span className="text-sm text-gray-600 mr-2">Filter:</span>
          <Button 
            variant={activeFilter === 'Question' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleFilterChange('Question')}
          >
            Questions
          </Button>
          <Button 
            variant={activeFilter === 'Opinion' ? 'primary' : 'secondary'} 
            size="small"
            onClick={() => handleFilterChange('Opinion')}
            className="ml-2"
          >
            Opinions
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

{loading ? (
  <div className="text-center py-8">
    <Loading size="large" message="Loading posts..." />
  </div>
) : posts.length === 0 ? (
  <div className="text-center py-8 bg-gray-50 rounded">
    <p className="text-gray-500">No posts found. Be the first to create one!</p>
    <Link to="/create" className="btn btn-primary mt-4">Create Post</Link>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map(post => (
    <div key={post.id} className="h-full"> {/* Add wrapper with h-full */}
      <PostCard post={post} />
    </div>
  ))}
</div>
)}
    </div>
  );
};

export default Home;