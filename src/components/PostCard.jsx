// src/components/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const PostCard = ({ post }) => {
  // Format the timestamp
  const formattedDate = post.created_at ? 
    format(new Date(post.created_at), 'MMM d, yyyy • h:mm a') : 
    'Unknown date';

  return (
    <Link to={`/post/${post.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs text-gray-500">{formattedDate}</p>
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
          
          <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2">{post.title}</h2>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>{post.upvotes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;