import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Upload, X, Image as ImageIcon, FileText, Eye } from 'lucide-react';
import { Project, ProjectStatus, ProjectImage, ProjectDocument, DocumentType } from '../types';
import { useProjectStore } from '../store/projectStore';
import { useClientStore } from '../store/clientStore';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectView } from '../components/ProjectView';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import { useSettingsStore } from '../store/settingsStore';
import { toast } from 'react-hot-toast';

export function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const { clients } = useClientStore();
  const { settings } = useSettingsStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedImages, setSelectedImages] = useState<{ before: ProjectImage[], after: ProjectImage[] }>({
    before: [],
    after: []
  });
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);

  // Get unique departments from projects
  const departments = Array.from(new Set(projects.map(p => p.departamento)));

  const handleImageUpload = (type: 'before' | 'after', files: FileList) => {
    const newImages = Array.from(files).map(file => ({
      id: Math.random().toString(),
      url: URL.createObjectURL(file),
      createdAt: new Date()
    }));

    setSelectedImages(prev => ({
      ...prev,
      [type]: [...prev[type], ...newImages]
    }));
  };

  const handleDocumentUpload = (type: DocumentType, file: File) => {
    const newDocument = {
      id: Math.random().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type,
      createdAt: new Date()
    };

    setDocuments(prev => [...prev, newDocument]);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const clientId = formData.get('client_id') as string;
    const client = clients.find(c => c.id === clientId);

    const newProject: Project = {
      id: Math.random().toString(),
      name: formData.get('name') as string,
      client_id: clientId,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      responsavel: formData.get('responsavel') as string,
      departamento: formData.get('departamento') as string,
      notes: formData.get('notes') as string,
      photos_before: selectedImages.before,
      photos_after: selectedImages.after,
      documents,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // Add project first
      addProject(newProject);
      
      // Try to send email notification if SMTP is configured
      if (client && settings.smtp?.host) {
        try {
          const emailData = {
            to: client.email,
            subject: `Novo Projeto: ${newProject.name}`,
            html: `
              <h2>Olá ${client.name},</h2>
              <p>Um novo projeto foi criado para você:</p>
              <h3>${newProject.name}</h3>
              <p><strong>Descrição:</strong></p>
              <p>${newProject.description}</p>
              <br>
              <p>Entraremos em contato em breve com mais detalhes.</p>
            `
          };

          // Send email notification (mock for now)
          console.log('Email notification would be sent:', emailData);
          toast.success('Projeto criado com sucesso!');
        } catch (emailError) {
          console.error('Erro ao enviar notificação:', emailError);
          toast.error('Projeto criado, mas não foi possível enviar a notificação');
        }
      } else {
        toast.success('Projeto criado com sucesso!');
      }

      setShowNewProject(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto');
    }
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updatedData = {
      name: formData.get('name') as string,
      client_id: formData.get('client_id') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as ProjectStatus,
      responsavel: formData.get('responsavel') as string,
      departamento: formData.get('departamento') as string,
      notes: formData.get('notes') as string,
      photos_before: selectedImages.before,
      photos_after: selectedImages.after,
      documents,
      updatedAt: new Date(),
    };
    
    updateProject(editingProject.id, updatedData);
    setEditingProject(null);
    resetForm();
    toast.success('Projeto atualizado com sucesso!');
  };

  const handleDeleteProject = () => {
    if (!deletingProject) return;
    deleteProject(deletingProject.id);
    setDeletingProject(null);
    toast.success('Projeto excluído com sucesso!');
  };

  const resetForm = () => {
    setSelectedImages({ before: [], after: [] });
    setDocuments([]);
  };

  // Filter projects based on all criteria
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clients.find(c => c.id === project.client_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.responsavel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || project.departamento === departmentFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      const today = new Date();
      const projectDate = new Date(project.updatedAt);
      
      switch (dateFilter) {
        case 'today':
          return projectDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          return projectDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          return projectDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Projetos</h1>
        <button
          onClick={() => setShowNewProject(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Novo Projeto</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center space-x-4">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="proposal_sent">Proposta Enviada</option>
              <option value="proposal_accepted">Proposta Aceite</option>
              <option value="approved">Aprovado</option>
              <option value="completed">Concluído</option>
              <option value="on_hold">Em Espera</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departamento
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">Todos os Departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Atualização
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">Todas as Datas</option>
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atualização
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProjects.map((project) => {
              const client = clients.find(c => c.id === project.client_id);
              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client?.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.responsavel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.departamento}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setViewingProject(project)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingProject(project)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showNewProject && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowNewProject(false)}
          title="Novo Projeto"
          selectedImages={selectedImages}
          documents={documents}
          onImageUpload={handleImageUpload}
          onImageRemove={(type, imageId) => {
            setSelectedImages(prev => ({
              ...prev,
              [type]: prev[type].filter(img => img.id !== imageId)
            }));
          }}
          onDocumentUpload={handleDocumentUpload}
          onDocumentRemove={(documentId) => {
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
          }}
        />
      )}

      {editingProject && (
        <ProjectForm
          onSubmit={handleEditProject}
          onCancel={() => setEditingProject(null)}
          initialData={editingProject}
          title="Editar Projeto"
          selectedImages={selectedImages}
          documents={documents}
          onImageUpload={handleImageUpload}
          onImageRemove={(type, imageId) => {
            setSelectedImages(prev => ({
              ...prev,
              [type]: prev[type].filter(img => img.id !== imageId)
            }));
          }}
          onDocumentUpload={handleDocumentUpload}
          onDocumentRemove={(documentId) => {
            setDocuments(prev => prev.filter(doc => doc.id !== documentId));
          }}
        />
      )}

      {viewingProject && (
        <ProjectView
          project={viewingProject}
          onClose={() => setViewingProject(null)}
          onEdit={() => {
            setViewingProject(null);
            setEditingProject(viewingProject);
          }}
        />
      )}

      {deletingProject && (
        <DeleteConfirmation
          onConfirm={handleDeleteProject}
          onCancel={() => setDeletingProject(null)}
          title="Excluir Projeto"
          message={`Tem certeza que deseja excluir o projeto ${deletingProject.name}?`}
        />
      )}
    </div>
  );
}