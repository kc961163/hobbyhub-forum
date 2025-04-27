// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { getPostById, upvotePost, deletePost } from '../services/postService';
import { createComment, getPostComments, deleteComment } from '../services/commentService';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, preferences } = useUser();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  useEffect(() => {
    fetchPostAndComments();
  }, [id]);
  
  const fetchPostAndComments = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        getPostById(id),
        getPostComments(id)
      ]);
      
      setPost(postData);
      setComments(commentsData);
    } catch (err) {
      console.error('Error fetching post details:', err);
      setError('Failed to load post. It may have been deleted or the connection failed.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpvote = async () => {
    try {
      const updatedPost = await upvotePost(id);
      setPost(updatedPost);
    } catch (err) {
      console.error('Error upvoting post:', err);
      setError('Failed to upvote post. Please try again.');
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    try {
      const comment = await createComment(id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      setCommentError('');
    } catch (err) {
      console.error('Error creating comment:', err);
      setCommentError('Failed to post comment. Please try again.');
    }
  };
  
  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
      setDeleteModalOpen(false);
    }
  };
  
  const isAuthor = post && post.author_id === userId;
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading post...</p>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error || 'Post not found'}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to home page
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to posts
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          
          <div className="flex items-center">
          <Button 
            onClick={handleUpvote} 
            variant="secondary" 
            size="medium"
            className="flex items-center"
          >
            <span role="img" aria-label="upvote" className="text-base mr-1">👍</span>
            <span className="font-medium">{post.upvotes || 0}</span>
          </Button>
            
            {isAuthor && (
              <div className="ml-4 flex">
                <Link to={`/post/${id}/edit`}>
                  <Button variant="secondary" size="small">Edit</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="small" 
                  onClick={() => setDeleteModalOpen(true)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </div>
        
        {post.flags && post.flags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.flags.map(flag => (
              <span 
                key={flag}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {flag}
              </span>
            ))}
          </div>
        )}
        
        {post.content && (
          <div className="mb-6 whitespace-pre-wrap">{post.content}</div>
        )}
        
        {post.image_url && (
          <div className="mb-6">
            <img 
              src={post.image_url} 
              alt={post.title}
              className="max-w-full max-h-96 rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
            {commentError && (
              <p className="text-red-600 text-sm mt-1">{commentError}</p>
            )}
          </div>
          <Button type="submit">Post Comment</Button>
        </form>
        
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="text-sm text-gray-500 mb-1">
                  Anonymous user • {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </div>
                <div className="whitespace-pre-wrap">{comment.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Post</h2>
            <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeletePost}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;