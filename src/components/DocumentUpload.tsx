import React from 'react';
import { FileText, Eye, X } from 'lucide-react';
import { DocumentType, ProjectDocument } from '../types';

interface DocumentUploadProps {
  type: DocumentType;
  document?: ProjectDocument;
  onUpload: (file: File) => void;
  onRemove: () => void;
  label: string;
}

export function DocumentUpload({ type, document, onUpload, onRemove, label }: DocumentUploadProps) {
  return (
    <div className="border rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {document ? (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="text-gray-400" size={20} />
            <span className="text-sm text-gray-600">{document.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => window.open(document.url)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Eye size={18} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-red-600 hover:text-red-900"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files && onUpload(e.target.files[0])}
          />
          <div className="text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-600">
              Selecionar arquivo
            </span>
          </div>
        </label>
      )}
    </div>
  );
}