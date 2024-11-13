import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { User } from '../types';
import { useUserStore } from '../store/userStore';
import { UserForm } from '../components/UserForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { toast } from 'react-hot-toast';

export function Users() {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const [showNewUser, setShowNewUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateUser = (data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...data,
      id: Math.random().toString(),
      createdAt: new Date(),
    };
    addUser(newUser);
    setShowNewUser(false);
    toast.success('Usuário criado com sucesso!');
  };

  const handleEditUser = (data: Omit<User, 'id' | 'createdAt'>) => {
    if (!editingUser) return;
    updateUser(editingUser.id, data);
    setEditingUser(null);
    toast.success('Usuário atualizado com sucesso!');
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    setDeletingUser(null);
    toast.success('Usuário excluído com sucesso!');
  };

  const filteredUsers = users.filter(user =>
    Object.values(user)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Usuários do Sistema</h1>
        <button
          onClick={() => setShowNewUser(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuários..."
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
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <UserCheck size={12} className="mr-1" />
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <UserX size={12} className="mr-1" />
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeletingUser(user)}
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

      {showNewUser && (
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowNewUser(false)}
          title="Novo Usuário"
        />
      )}

      {editingUser && (
        <UserForm
          onSubmit={handleEditUser}
          onCancel={() => setEditingUser(null)}
          initialData={editingUser}
          title="Editar Usuário"
        />
      )}

      {deletingUser && (
        <DeleteConfirmation
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
          title="Excluir Usuário"
          message={`Tem certeza que deseja excluir o usuário ${deletingUser.name}?`}
        />
      )}
    </div>
  );
}