import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bb_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('bb_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const d = await api.post('/auth/login', { email, password });
    localStorage.setItem('bb_token', d.token);
    setUser(d.user);
    return d.user;
  }

  async function adminLogin(email, password) {
    const d = await api.post('/auth/admin/login', { email, password });
    localStorage.setItem('bb_token', d.token);
    setUser(d.user);
    return d.user;
  }

  async function register(name, email, password, phone) {
    const d = await api.post('/auth/register', { name, email, password, phone });
    localStorage.setItem('bb_token', d.token);
    setUser(d.user);
    return d.user;
  }

  function logout() {
    localStorage.removeItem('bb_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
