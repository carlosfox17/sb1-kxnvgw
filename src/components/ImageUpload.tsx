import React from 'react';
import { X, Upload } from 'lucide-react';
import { ProjectImage } from '../types';

interface ImageUploadProps {
  images: ProjectImage[];
  onUpload: (files: FileList) => void;
  onRemove: (imageId: string) => void;
  label: string;
}

export function ImageUpload({ images, onUpload, onRemove, label }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onUpload(e.target.files)}
          />
          <Upload className="text-gray-400" />
        </label>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Clique para selecionar múltiplas fotos
      </p>
    </div>
  );
}