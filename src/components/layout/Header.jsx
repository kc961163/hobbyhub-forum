// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-primary">HobbyHub</Link>
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/create" className="btn btn-primary">Create Post</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;