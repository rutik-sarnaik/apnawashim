import { useState, useEffect } from 'react';
import { User, Complaint } from './types';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'citizen' | 'admin'>('landing');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setView(data.user.role === 'admin' ? 'admin' : 'citizen');
        }
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setView('landing');
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar user={user} onLogout={handleLogout} setView={setView} currentView={view} />
      
      <main className="container mx-auto px-4 py-8">
        {view === 'landing' && <LandingPage setView={setView} />}
        {view === 'login' && <Login setUser={setUser} setView={setView} />}
        {view === 'register' && <Register setUser={setUser} setView={setView} />}
        {view === 'citizen' && user && <CitizenDashboard user={user} />}
        {view === 'admin' && user && user.role === 'admin' && <AdminDashboard user={user} />}
      </main>
    </div>
  );
}
