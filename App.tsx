import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsChart from './components/StatsChart';
import TeamChat from './components/TeamChat';
import ProjectCard from './components/ProjectCard';
import TaskBoard from './components/TaskBoard';
import AuthPage from './AuthPage';
import AdminTaskModal from './AdminTaskModal';
import AddEmployeeModal from './AddEmployeeModal';
import ProjectModal from './components/ProjectModal';
import ProfileView from './ProfileView';
import CustomDropdown from './components/CustomDropdown';
import { CURRENT_USER, ADMIN_USER, MOCK_PROJECTS, MOCK_NOTIFICATIONS, TEAM_MEMBERS } from './constants';
import { UserRole, Task, User, Project } from './types';
import { Filter, Plus, ArrowUpDown } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Data State
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [teamMembers, setTeamMembers] = useState<User[]>(TEAM_MEMBERS);

  // Filter & Sort State
  const [projectFilter, setProjectFilter] = useState('All');
  const [projectSort, setProjectSort] = useState('dueDate');

  // Sync dark mode
  React.useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogin = (role: UserRole, email: string) => {
    // Determine user based on role for demo purposes
    if (role === UserRole.ADMIN) {
      setCurrentUser({...ADMIN_USER, email});
    } else {
      setCurrentUser({...CURRENT_USER, email});
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleAssignTask = (taskData: any) => {
     const newTask: Task = {
       id: Date.now().toString(),
       title: taskData.title,
       description: taskData.description,
       status: taskData.status,
       priority: taskData.priority,
       assignee: taskData.assignee,
       dueDate: taskData.dueDate,
       image: taskData.image
     };

     // For demo, add to first project
     const updatedProjects = [...projects];
     if (updatedProjects.length > 0) {
        updatedProjects[0].tasks.push(newTask);
        setProjects(updatedProjects);
     }
  };

  const handleAddEmployee = (empData: any) => {
      const newEmployee: User = {
          id: `u${Date.now()}`,
          ...empData
      };
      setTeamMembers([...teamMembers, newEmployee]);
  };

  const handleSaveProject = (project: Project) => {
      if (projects.find(p => p.id === project.id)) {
          // Edit
          setProjects(projects.map(p => p.id === project.id ? project : p));
      } else {
          // Add
          setProjects([...projects, project]);
      }
      setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
      if (confirm('Are you sure you want to delete this project?')) {
          setProjects(projects.filter(p => p.id !== id));
          setIsProjectModalOpen(false);
          setEditingProject(null);
      }
  };

  const openEditProject = (project: Project) => {
      setEditingProject(project);
      setIsProjectModalOpen(true);
  };

  // Logic for filtering and sorting projects
  const getProcessedProjects = () => {
    let processed = [...projects];

    // Filter
    if (projectFilter !== 'All') {
      processed = processed.filter(p => p.status === projectFilter);
    }

    // Sort
    processed.sort((a, b) => {
      if (projectSort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (projectSort === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return processed;
  };

  const filteredProjects = getProcessedProjects();

  if (!isAuthenticated) {
    return (
      <>
        <div className={`fixed top-4 right-4 z-50`}>
           <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
                {isDarkMode ? '☀️' : '🌙'}
            </button>
        </div>
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Welcome */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {currentUser.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Dashboard'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {currentUser.name}</p>
               </div>
               {currentUser.role === UserRole.ADMIN && (
                 <div className="flex gap-2">
                    <button 
                        onClick={() => setIsEmployeeModalOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-lighter border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add User
                    </button>
                    <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl shadow-lg shadow-secondary/30 hover:bg-secondary/90 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Assign Task
                    </button>
                 </div>
               )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', val: projects.length.toString(), change: '+2', color: 'bg-blue-500' },
                { label: 'Tasks Completed', val: currentUser.role === UserRole.ADMIN ? '142' : '28', change: '+18%', color: 'bg-green-500' },
                { label: 'Pending Review', val: '8', change: '-2', color: 'bg-orange-500' },
                { label: 'Team Velocity', val: '84%', change: '+4%', color: 'bg-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-dark-lighter p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                  <div className="flex items-end justify-between mt-2">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.val}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className={`mt-4 h-1 w-full rounded-full opacity-20 ${stat.color}`}></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-2">
                <StatsChart />
              </div>
              
              {/* Chat Area */}
              <div className="lg:col-span-1">
                <TeamChat currentUser={currentUser} />
              </div>
            </div>

            {/* Recent Projects Snippet */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Active Projects</h3>
                <button 
                    onClick={() => setActiveTab('projects')}
                    className="text-primary text-sm hover:underline font-medium"
                >
                    View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map(p => (
                   <ProjectCard 
                        key={p.id} 
                        project={p} 
                        onEdit={currentUser.role === UserRole.ADMIN ? openEditProject : undefined} 
                   />
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Projects</h2>
                 <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your ongoing initiatives</p>
               </div>
               <div className="flex flex-wrap gap-3 items-center">
                 <div className="w-40 z-20">
                    <CustomDropdown
                        options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'Active', label: 'Active', icon: <span className="w-2 h-2 rounded-full bg-green-500"/> },
                            { value: 'Completed', label: 'Completed', icon: <span className="w-2 h-2 rounded-full bg-blue-500"/> },
                            { value: 'On Hold', label: 'On Hold', icon: <span className="w-2 h-2 rounded-full bg-orange-500"/> },
                        ]}
                        value={projectFilter}
                        onChange={setProjectFilter}
                        icon={<Filter className="w-4 h-4" />}
                    />
                 </div>
                 <div className="w-40 z-20">
                    <CustomDropdown
                        options={[
                            { value: 'dueDate', label: 'Due Date' },
                            { value: 'name', label: 'Name (A-Z)' },
                        ]}
                        value={projectSort}
                        onChange={setProjectSort}
                        icon={<ArrowUpDown className="w-4 h-4" />}
                    />
                 </div>
                 {currentUser.role === UserRole.ADMIN && (
                    <button 
                        onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-bold h-[46px]"
                    >
                        <Plus className="w-4 h-4" /> New
                    </button>
                 )}
               </div>
            </div>
            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Filter className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No projects match your filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(p => (
                    <ProjectCard 
                        key={p.id} 
                        project={p} 
                        onEdit={currentUser.role === UserRole.ADMIN ? openEditProject : undefined}
                    />
                ))}
                </div>
            )}
          </div>
        );

      case 'tasks':
        // For demo, aggregating tasks from first 2 projects
        const allTasks = projects.flatMap(p => p.tasks);
        return (
             <div className="h-full animate-in fade-in duration-500">
                <TaskBoard tasks={allTasks} />
             </div>
        );

      case 'settings':
        return (
            <div className="animate-in fade-in duration-500">
                <ProfileView user={currentUser} />
            </div>
        );

      case 'team':
         return (
             <div className="animate-in fade-in duration-500">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Collaborators</h2>
                    {currentUser.role === UserRole.ADMIN && (
                        <button 
                            onClick={() => setIsEmployeeModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all font-bold"
                        >
                            <Plus className="w-4 h-4" /> Add Member
                        </button>
                    )}
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map(member => (
                        <div key={member.id} className="bg-white dark:bg-dark-lighter p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                            <img src={member.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-dark-lighter relative z-10 shadow-md" />
                            <h3 className="font-bold text-lg dark:text-white relative z-10">{member.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 relative z-10">{member.jobTitle || member.role}</p>
                            <div className="flex justify-center gap-2 mb-4 relative z-10">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                                    {member.role}
                                </span>
                            </div>
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">Chat</button>
                                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 font-medium">Profile</button>
                            </div>
                        </div>
                    ))}
                 </div>
             </div>
         );

      default:
        return <div className="p-10 text-center text-gray-500">Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark transition-colors duration-300 font-sans">
      <Sidebar 
        user={currentUser} 
        isOpen={isSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onAddEmployee={() => setIsEmployeeModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          notifications={MOCK_NOTIFICATIONS}
          user={currentUser}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 relative scroll-smooth">
           <div className="max-w-7xl mx-auto h-full">
             {renderContent()}
           </div>
        </main>
      </div>

      <AdminTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onAssign={handleAssignTask}
        members={teamMembers}
      />

      <AddEmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => { setIsProjectModalOpen(false); setEditingProject(null); }}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        editingProject={editingProject}
        allMembers={teamMembers}
      />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;