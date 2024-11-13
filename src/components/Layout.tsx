import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  UserCog, 
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronRight,
  Mail
} from 'lucide-react';
import { UserProfile } from './UserProfile';

export function Layout() {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const [showProfile, setShowProfile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActiveRoute(to)
          ? 'bg-indigo-100 text-indigo-900'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} className={isActiveRoute(to) ? 'text-indigo-600' : 'text-gray-500'} />
      <span className={`${!isSidebarOpen && 'hidden'}`}>{children}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.appName} className="h-8 w-8" />
              ) : (
                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
              )}
              {isSidebarOpen && <span className="font-bold text-xl">{settings.appName}</span>}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <NavLink to="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </NavLink>
              <NavLink to="/projects" icon={FolderKanban}>
                Projetos
              </NavLink>
              {user.role === 'admin' && (
                <>
                  <NavLink to="/clients" icon={Users}>
                    Clientes
                  </NavLink>
                  <NavLink to="/users" icon={UserCog}>
                    Usuários
                  </NavLink>
                  <NavLink to="/notifications" icon={Mail}>
                    Notificações
                  </NavLink>
                  <NavLink to="/settings" icon={SettingsIcon}>
                    Configurações
                  </NavLink>
                </>
              )}
            </nav>
          )}

          {/* User Section */}
          {user && (
            <div className="border-t p-4">
              <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                >
                  <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  )}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className={`mt-4 flex items-center space-x-3 text-red-600 hover:text-red-700 w-full
                  ${!isSidebarOpen && 'justify-center'}`}
              >
                <LogOut size={20} />
                {isSidebarOpen && <span>Sair</span>}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>

      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  );
}