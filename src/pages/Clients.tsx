import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Client } from '../types';
import { useClientStore } from '../store/clientStore';
import { ClientForm } from '../components/ClientForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { toast } from 'react-hot-toast';

export function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const [showNewClient, setShowNewClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateClient = (data: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...data,
      id: Math.random().toString(),
    };
    addClient(newClient);
    setShowNewClient(false);
    toast.success('Cliente criado com sucesso!');
  };

  const handleEditClient = (data: Omit<Client, 'id'>) => {
    if (!editingClient) return;
    updateClient(editingClient.id, data);
    setEditingClient(null);
    toast.success('Cliente atualizado com sucesso!');
  };

  const handleDeleteClient = () => {
    if (!deletingClient) return;
    deleteClient(deletingClient.id);
    setDeletingClient(null);
    toast.success('Cliente excluído com sucesso!');
  };

  const filteredClients = clients.filter(client =>
    Object.values(client)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={() => setShowNewClient(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {client.company}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingClient(client)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewClient && (
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setShowNewClient(false)}
          title="Novo Cliente"
        />
      )}

      {editingClient && (
        <ClientForm
          onSubmit={handleEditClient}
          onCancel={() => setEditingClient(null)}
          initialData={editingClient}
          title="Editar Cliente"
        />
      )}

      {deletingClient && (
        <DeleteConfirmation
          onConfirm={handleDeleteClient}
          onCancel={() => setDeletingClient(null)}
          title="Excluir Cliente"
          message={`Tem certeza que deseja excluir o cliente ${deletingClient.name}?`}
        />
      )}
    </div>
  );
}