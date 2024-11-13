import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { useClientStore } from '../store/clientStore';
import { useUserStore } from '../store/userStore';
import { BarChart, Users, FolderKanban, CheckCircle, Clock, AlertTriangle, UserCheck } from 'lucide-react';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { projects } = useProjectStore();
  const { clients } = useClientStore();
  const { users } = useUserStore();

  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const pendingProjects = projects.filter(p => p.status === 'pending').length;
  const activeUsers = users.filter(u => u.active).length;

  const stats = [
    {
      title: 'Projetos Ativos',
      value: activeProjects.toString(),
      icon: FolderKanban,
      color: 'bg-blue-500',
      description: 'Projetos em andamento',
    },
    {
      title: 'Clientes',
      value: clients.length.toString(),
      icon: Users,
      color: 'bg-green-500',
      description: 'Total de clientes cadastrados',
    },
    {
      title: 'Projetos Concluídos',
      value: completedProjects.toString(),
      icon: CheckCircle,
      color: 'bg-purple-500',
      description: 'Projetos finalizados com sucesso',
    },
    {
      title: 'Taxa de Sucesso',
      value: projects.length ? `${Math.round((completedProjects / projects.length) * 100)}%` : '0%',
      icon: BarChart,
      color: 'bg-yellow-500',
      description: 'Taxa de conclusão de projetos',
    },
  ];

  const recentProjects = projects
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-indigo-500 rounded-full flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Bem-vindo, {user?.name}!
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{stat.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Projetos Recentes
            </h2>
            <Clock className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">
                    Atualizado em {project.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
            {recentProjects.length === 0 && (
              <p className="text-gray-600">Nenhum projeto recente para exibir.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Status do Sistema
            </h2>
            <AlertTriangle className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Projetos Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{pendingProjects}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Distribuição de Projetos
              </h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(completedProjects / Math.max(projects.length, 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {completedProjects} de {projects.length} projetos concluídos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}