import React from 'react';
import { Client, Project, ProjectImage, ProjectDocument, DocumentType } from '../types';
import { useClientStore } from '../store/clientStore';
import { ImageUpload } from './ImageUpload';
import { DocumentUpload } from './DocumentUpload';
import { X } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  title: string;
  selectedImages: {
    before: ProjectImage[];
    after: ProjectImage[];
  };
  documents: ProjectDocument[];
  onImageUpload: (type: 'before' | 'after', files: FileList) => void;
  onImageRemove: (type: 'before' | 'after', imageId: string) => void;
  onDocumentUpload: (type: DocumentType, file: File) => void;
  onDocumentRemove: (documentId: string) => void;
  initialData?: Project;
}

export function ProjectForm({
  onSubmit,
  onCancel,
  title,
  selectedImages,
  documents,
  onImageUpload,
  onImageRemove,
  onDocumentUpload,
  onDocumentRemove,
  initialData,
}: ProjectFormProps) {
  const { clients } = useClientStore();

  const documentTypes: { type: DocumentType; label: string }[] = [
    { type: 'proposta_comercial', label: 'Proposta Comercial' },
    { type: 'po', label: 'P.O' },
    { type: 'guia_entrega', label: 'Guia de Entrega' },
    { type: 'fatura', label: 'Fatura' },
    { type: 'recibo', label: 'Recibo' },
    { type: 'certificacao', label: 'Certificação' },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl my-8">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 rounded-t-lg">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <form id="project-form" onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Projeto
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
                    Cliente
                  </label>
                  <select 
                    name="client_id"
                    required
                    defaultValue={initialData?.client_id}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.company}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select 
                    name="status"
                    required
                    defaultValue={initialData?.status}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="pending">Pendente</option>
                    <option value="proposal_sent">Proposta Enviada</option>
                    <option value="proposal_accepted">Proposta Aceite</option>
                    <option value="approved">Aprovado</option>
                    <option value="completed">Concluído</option>
                    <option value="on_hold">Em Espera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsável
                  </label>
                  <input
                    type="text"
                    name="responsavel"
                    required
                    defaultValue={initialData?.responsavel}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    required
                    defaultValue={initialData?.departamento}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  name="description"
                  required
                  defaultValue={initialData?.description}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas
                </label>
                <textarea
                  name="notes"
                  defaultValue={initialData?.notes}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-6">
                <ImageUpload
                  label="Fotos Antes"
                  images={selectedImages.before}
                  onUpload={(files) => onImageUpload('before', files)}
                  onRemove={(imageId) => onImageRemove('before', imageId)}
                />

                <ImageUpload
                  label="Fotos Depois"
                  images={selectedImages.after}
                  onUpload={(files) => onImageUpload('after', files)}
                  onRemove={(imageId) => onImageRemove('after', imageId)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentTypes.map(({ type, label }) => {
                  const doc = documents.find(d => d.type === type);
                  return (
                    <DocumentUpload
                      key={type}
                      type={type}
                      label={label}
                      document={doc}
                      onUpload={(file) => onDocumentUpload(type, file)}
                      onRemove={() => doc && onDocumentRemove(doc.id)}
                    />
                  );
                })}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white px-8 py-4 border-t border-gray-200 rounded-b-lg">
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
                form="project-form"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {initialData ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}