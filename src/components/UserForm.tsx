import React from 'react';
import { User } from '../types';

interface UserFormProps {
  onSubmit: (data: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: User;
  title: string;
}

export function UserForm({ onSubmit, onCancel, initialData, title }: UserFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as 'admin' | 'employee',
      department: formData.get('department') as string,
      active: formData.get('active') === 'true',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={initialData?.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              name="password"
              required={!initialData}
              placeholder={initialData ? '••••••••' : ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {initialData && (
              <p className="mt-1 text-sm text-gray-500">
                Deixe em branco para manter a senha atual
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Função
            </label>
            <select
              name="role"
              required
              defaultValue={initialData?.role}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="admin">Administrador</option>
              <option value="employee">Funcionário</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Departamento
            </label>
            <input
              type="text"
              name="department"
              required
              defaultValue={initialData?.department}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="active"
              required
              defaultValue={initialData?.active ? 'true' : 'false'}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {initialData ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}