import React from 'react';
import { Project } from '../types';
import { MoreHorizontal, Calendar, Edit2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'On Hold': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col h-full">
      {/* Cover Image */}
      <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
        {project.image ? (
            <img src={project.image} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
        )}
        <div className="absolute top-3 left-3">
             <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
        </div>
        {onEdit && (
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 text-gray-700 dark:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-black/70 shadow-lg translate-y-2 group-hover:translate-y-0"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">{project.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{project.description}</p>

        <div className="mb-4">
            <div className="flex justify-between text-xs mb-1 text-gray-500 dark:text-gray-400 font-medium">
            <span>Progress</span>
            <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div 
                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                style={{ width: `${project.progress}%` }}
            ></div>
            </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700/50 mt-auto">
            <div className="flex -space-x-2">
            {project.members.map((member, i) => (
                <div key={member.id} className="relative group/avatar">
                    <img 
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-lighter object-cover hover:z-10 transition-all hover:scale-110 cursor-pointer"
                    />
                     {/* Tooltip for Job Title */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover/avatar:opacity-100 pointer-events-none whitespace-nowrap z-20">
                        {member.jobTitle || member.role}
                    </div>
                </div>
            ))}
            {project.members.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-lighter bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-500">
                    +{project.members.length - 3}
                </div>
            )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-lg font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
            {new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;