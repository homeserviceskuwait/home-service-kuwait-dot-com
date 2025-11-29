import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useLanguage } from '../LanguageContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    setLanguage('en');
  }, [setLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login({ email, password });
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-800">
        <div className="flex justify-center mb-6">
          <Logo className="w-16 h-16" />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">Admin Login</h2>
        <p className="text-center text-slate-500 mb-8">Please enter your credentials</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Email Address"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Password"
              required
            />
            {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-teal-600/20"
          >
            Access Dashboard
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-slate-400 hover:text-teal-600">Back to Website</a>
        </div>
      </div>
    </div>
  );
};

export default Login;