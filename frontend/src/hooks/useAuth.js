import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('efarm_token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('efarm_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone, password) => {
    const res = await authAPI.login({ phone, password });
    localStorage.setItem('efarm_token', res.token);
    setUser(res.data);
    return res;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    localStorage.setItem('efarm_token', res.token);
    setUser(res.data);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('efarm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
