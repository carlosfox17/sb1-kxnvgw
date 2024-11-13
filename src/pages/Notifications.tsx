import React, { useState, useEffect } from 'react';
import { Plus, Mail, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { EmailTemplate, EmailLog } from '../types';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { NotificationForm } from '../components/NotificationForm';
import { DeleteConfirmation } from '../components/DeleteConfirmation';

export function Notifications() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<EmailTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
    loadLogs();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await api.get('/notifications');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Erro ao carregar templates');
    }
  };

  const loadLogs = async () => {
    try {
      const response = await api.get('/email_logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error loading logs:', error);
      toast.error('Erro ao carregar logs');
    }
  };

  const handleCreateTemplate = async (data: Omit<EmailTemplate, 'id'>) => {
    try {
      const newTemplate = {
        ...data,
        id: Date.now().toString(),
      };
      await api.post('/notifications', newTemplate);
      toast.success('Template criado com sucesso!');
      setShowNewTemplate(false);
      loadTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Erro ao criar template');
    }
  };

  const handleUpdateTemplate = async (id: string, data: Partial<EmailTemplate>) => {
    try {
      await api.patch(`/notifications/${id}`, data);
      toast.success('Template atualizado com sucesso!');
      setEditingTemplate(null);
      loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Erro ao atualizar template');
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deletingTemplate) return;

    try {
      await api.delete(`/notifications/${deletingTemplate.id}`);
      toast.success('Template excluído com sucesso!');
      setDeletingTemplate(null);
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Erro ao excluir template');
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      await api.patch(`/notifications/${template.id}`, {
        active: !template.active,
      });
      toast.success('Status atualizado com sucesso!');
      loadTemplates();
    } catch (error) {
      console.error('Error toggling template status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notificações por Email</h1>
        <button
          onClick={() => setShowNewTemplate(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Novo Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Templates de Email</h2>
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Mail className="text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{template.subject}</h3>
                    <p className="text-sm text-gray-500">Template: {template.template}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(template)}
                    className={`p-1 rounded-full ${
                      template.active ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {template.active ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-1 text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setDeletingTemplate(template)}
                    className="p-1 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum template encontrado</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Envios</h2>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{log.subject}</h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status === 'success' ? 'Enviado' : 'Erro'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Para: {log.to}</p>
                <p className="text-sm text-gray-500">
                  Data: {new Date(log.sentAt).toLocaleString()}
                </p>
                {log.error && (
                  <p className="text-sm text-red-600 mt-2">{log.error}</p>
                )}
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum log encontrado</p>
            )}
          </div>
        </div>
      </div>

      {showNewTemplate && (
        <NotificationForm
          onSubmit={handleCreateTemplate}
          onCancel={() => setShowNewTemplate(false)}
          title="Novo Template de Email"
        />
      )}

      {editingTemplate && (
        <NotificationForm
          onSubmit={(data) => handleUpdateTemplate(editingTemplate.id, data)}
          onCancel={() => setEditingTemplate(null)}
          initialData={editingTemplate}
          title="Editar Template de Email"
        />
      )}

      {deletingTemplate && (
        <DeleteConfirmation
          onConfirm={handleDeleteTemplate}
          onCancel={() => setDeletingTemplate(null)}
          title="Excluir Template"
          message={`Tem certeza que deseja excluir o template "${deletingTemplate.subject}"?`}
        />
      )}
    </div>
  );
}