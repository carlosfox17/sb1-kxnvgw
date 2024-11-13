import React from 'react';
import { FileText, Eye, Edit2, X } from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { useClientStore } from '../store/clientStore';

interface ProjectViewProps {
  project: Project;
  onClose: () => void;
  onEdit: () => void;
}

export function ProjectView({ project, onClose, onEdit }: ProjectViewProps) {
  const { clients } = useClientStore();
  const client = clients.find(c => c.id === project.client_id);

  const getStatusLabel = (status: ProjectStatus) => {
    const statusMap: Record<ProjectStatus, string> = {
      pending: 'Pendente',
      proposal_sent: 'Proposta Enviada',
      proposal_accepted: 'Proposta Aceite',
      approved: 'Aprovado',
      completed: 'Concluído',
      on_hold: 'Em Espera'
    };
    return statusMap[status];
  };

  const getStatusStyle = (status: ProjectStatus) => {
    const styleMap: Record<ProjectStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      proposal_sent: 'bg-blue-100 text-blue-800',
      proposal_accepted: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      on_hold: 'bg-red-100 text-red-800'
    };
    return styleMap[status];
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl my-8">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                <Edit2 size={16} className="mr-2" />
                Editar
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                      <dd className="mt-1 text-sm text-gray-900">{client?.name} - {client?.company}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(project.status)}`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Responsável</dt>
                      <dd className="mt-1 text-sm text-gray-900">{project.responsavel}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Departamento</dt>
                      <dd className="mt-1 text-sm text-gray-900">{project.departamento}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                      <dd className="mt-1 text-sm text-gray-900">{project.description}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Notas</dt>
                      <dd className="mt-1 text-sm text-gray-900">{project.notes || 'Sem notas'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos Antes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.photos_before.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt="Foto antes"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => window.open(photo.url)}
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <Eye className="text-white" size={20} />
                        </button>
                      </div>
                    ))}
                    {project.photos_before.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhuma foto antes disponível</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos Depois</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.photos_after.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt="Foto depois"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => window.open(photo.url)}
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                        >
                          <Eye className="text-white" size={20} />
                        </button>
                      </div>
                    ))}
                    {project.photos_after.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhuma foto depois disponível</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText className="text-gray-400" size={20} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(doc.url)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    ))}
                    {project.documents.length === 0 && (
                      <p className="text-sm text-gray-500">Nenhum documento disponível</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}