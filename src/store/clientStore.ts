import { create } from 'zustand';
import { Client } from '../types';

interface ClientState {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [
    {
      id: '1',
      name: 'Empresa ABC',
      email: 'contato@empresaabc.com',
      phone: '(11) 99999-9999',
      company: 'Empresa ABC Ltda',
    },
    {
      id: '2',
      name: 'Empresa XYZ',
      email: 'contato@empresaxyz.com',
      phone: '(11) 88888-8888',
      company: 'Empresa XYZ Ltda',
    },
  ],
  setClients: (clients) => set({ clients }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (id, data) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...data } : client
      ),
    })),
  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    })),
}));