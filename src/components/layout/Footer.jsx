// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p className="text-center">© {new Date().getFullYear()} HobbyHub - A place for enthusiasts</p>
      </div>
    </footer>
  );
};

export default Footer;