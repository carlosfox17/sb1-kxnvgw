import { create } from 'zustand';
import { Project, ProjectStatus } from '../types';

interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [
    {
      id: '1',
      name: 'Projeto ABC',
      client_id: '1',
      description: 'Descrição do projeto',
      photos_before: [],
      photos_after: [],
      notes: '',
      status: 'pending',
      responsavel: 'João Silva',
      departamento: 'Engenharia',
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...data } : project
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
}));