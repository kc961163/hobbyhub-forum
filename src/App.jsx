// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { getCurrentUser } from './services/authService';
import './styles/main.css'; // Import our custom CSS instead of Tailwind

function App() {
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const initUser = async () => {
      const id = await getCurrentUser();
      setUserId(id);
    };
    
    initUser();
  }, []);
  
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;