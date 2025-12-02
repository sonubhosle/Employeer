import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  PlusCircle,
  TrendingUp,
  Globe
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onAddEmployee?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, activeTab, setActiveTab, onLogout, onAddEmployee }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'team', label: 'Collaborators', icon: Users },
    ...(isAdmin ? [
      { id: 'reports', label: 'Global Reports', icon: TrendingUp },
      { id: 'news', label: 'Company News', icon: Globe }
    ] : []),
  ];

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-dark-lighter border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}
    >
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-primary/20 p-1"
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white dark:border-dark-lighter rounded-full ${user.role === UserRole.ADMIN ? 'bg-secondary' : 'bg-green-500'}`}></div>
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-white">{user.name}</h2>
          <span className="text-xs font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full mt-1 uppercase tracking-wider">
            {user.role}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
          {isAdmin && (
             <button 
               onClick={onAddEmployee}
               className="w-full flex items-center justify-center px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-lg transition-colors text-sm font-medium"
             >
               <PlusCircle className="w-4 h-4 mr-2" />
               New Employee
             </button>
          )}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 ${activeTab === 'settings' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;