// Complete PostCard.jsx implementation
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post }) => {
  const formattedDate = post.created_at ? 
    formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : 
    'Unknown date';

  return (
    <Link to={`/post/${post.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500">Posted {formattedDate}</p>
            {post.flags && post.flags.length > 0 && (
              <div className="flex space-x-2">
                {post.flags.map(flag => (
                  <span key={flag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{post.title}</h2>
          
          <div className="mt-auto pt-3 flex justify-between items-center">
            <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded">
              <span role="img" aria-label="upvote" className="text-base mr-1">👍</span>
              <span className="font-medium">{post.upvotes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;