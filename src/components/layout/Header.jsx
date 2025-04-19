// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">HobbyHub</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            </li>
            <li>
              <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create Post</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;