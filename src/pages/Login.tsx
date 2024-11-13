import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const findUserByEmailAndPassword = useUserStore((state) => state.findUserByEmailAndPassword);
  const { login, rememberMe, setRememberMe } = useAuthStore();
  const { settings } = useSettingsStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = findUserByEmailAndPassword(email, password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      login(userWithoutPassword);
      navigate('/dashboard');
      toast.success('Bem-vindo de volta!');
    } else {
      toast.error('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.appName}
              className="h-16 w-auto"
            />
          ) : (
            <LogIn className="h-12 w-12 text-indigo-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {settings.appName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Lembrar-me
            </label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}