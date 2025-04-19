// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, getUserPreferences } from '../services/authService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initUser = async () => {
      try {
        const id = await getCurrentUser();
        setUserId(id);
        
        const prefs = await getUserPreferences(id);
        setPreferences(prefs);
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initUser();
  }, []);
  
  const value = {
    userId,
    preferences,
    loading,
    refreshPreferences: async () => {
      if (userId) {
        const prefs = await getUserPreferences(userId);
        setPreferences(prefs);
      }
    }
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);