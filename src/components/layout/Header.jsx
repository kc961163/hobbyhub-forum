// src/components/layout/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            HobbyHub
          </Link>
          <nav className="flex items-center">
  <Link 
    to="/" 
    className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'} mr-3`}
  >
    Home
  </Link>
  <Link 
    to="/create" 
    className={`btn ${location.pathname === '/create' ? 'btn-primary' : 'btn-secondary'}`}
  >
    Create Post
  </Link>
</nav>
        </div>
      </div>
    </header>
  );
};

export default Header;