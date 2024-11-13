import React from 'react';
import { EmailTemplate } from '../types';
import { X } from 'lucide-react';

interface NotificationFormProps {
  onSubmit: (data: Omit<EmailTemplate, 'id'>) => void;
  onCancel: () => void;
  initialData?: EmailTemplate;
  title: string;
}

export function NotificationForm({
  onSubmit,
  onCancel,
  initialData,
  title,
}: NotificationFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      subject: formData.get('subject') as string,
      template: formData.get('template') as string,
      active: formData.get('active') === 'true',
      content: {
        title: formData.get('contentTitle') as string,
        body: formData.get('contentBody') as string,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assunto do Email
              </label>
              <input
                type="text"
                name="subject"
                required
                defaultValue={initialData?.subject}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Identificador do Template
              </label>
              <input
                type="text"
                name="template"
                required
                defaultValue={initialData?.template}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ex: welcome, new_project, status_update
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Título do Conteúdo
              </label>
              <input
                type="text"
                name="contentTitle"
                required
                defaultValue={initialData?.content.title}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Suporta variáveis: {{name}}, {{projectName}}, etc.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Conteúdo do Email
              </label>
              <textarea
                name="contentBody"
                required
                defaultValue={initialData?.content.body}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Suporta variáveis: {{name}}, {{projectName}}, {{projectDescription}}, etc.
              </p>
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
          </div>

          <div className="flex justify-end space-x-3">
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