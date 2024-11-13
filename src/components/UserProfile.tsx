import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { X, User, Mail, Briefcase, Calendar, Edit2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const user = useAuthStore((state) => state.user);
  const { updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) return null;

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const updateData: any = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
    };

    if (formData.newPassword) {
      updateData.password = formData.newPassword;
    }

    updateUser(user.id, updateData);
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Perfil do Usuário</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                <Edit2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-indigo-600" />
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Departamento</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save size={16} className="mr-2" />
                  Salvar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Função</p>
                  <p className="font-medium">
                    {user.role === 'admin' ? 'Administrador' : 'Funcionário'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Departamento</p>
                  <p className="font-medium">{user.department}</p>
                </div>
              </div>

              {user.createdAt && (
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Membro desde</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}