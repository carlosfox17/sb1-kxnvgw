import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (user: Omit<User, 'password'>) => void;
  logout: () => void;
  setRememberMe: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setRememberMe: (value) => set({ rememberMe: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => 
        state.rememberMe ? state : { rememberMe: state.rememberMe },
    }
  )
);