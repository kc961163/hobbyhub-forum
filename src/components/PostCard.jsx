// src/components/PostCard.jsx - Update to ensure consistent styling
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block">
      <div className="card mb-4">
        <div className="card-body">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
            {post.flags && post.flags.length > 0 && (
              <div className="flex gap-2">
                {post.flags.map(flag => (
                  <span key={flag} className="badge badge-blue">
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <h2 className="card-title">{post.title}</h2>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center text-gray-500">
              <span className="mr-1">👍</span>
              <span>{post.upvotes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;