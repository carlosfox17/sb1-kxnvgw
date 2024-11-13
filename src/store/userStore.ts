import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  findUserByEmailAndPassword: (email: string, password: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@sistema.com',
      password: '12345678',
      role: 'admin',
      department: 'Administração',
      active: true,
      createdAt: new Date().toISOString(),
    }
  ],
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  findUserByEmailAndPassword: (email, password) => 
    get().users.find(user => 
      user.email === email && 
      user.password === password && 
      user.active
    ),
}));