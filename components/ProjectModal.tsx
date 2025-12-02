import React, { useState, useEffect } from 'react';
import { Project, User, UserRole } from '../types';
import { X, Upload, Calendar, Type, Save, Trash2 } from 'lucide-react';
import CustomDropdown, { DropdownOption } from './CustomDropdown';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  editingProject?: Project | null;
  allMembers: User[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  editingProject, 
  allMembers 
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'Active',
    dueDate: '',
    members: [],
    image: '',
    progress: 0
  });

  // Reset or Load data
  useEffect(() => {
    if (isOpen) {
      if (editingProject) {
        setFormData({ ...editingProject });
      } else {
        setFormData({
            name: '',
            description: '',
            status: 'Active',
            dueDate: '',
            members: [],
            image: '',
            progress: 0,
            tasks: []
        });
      }
    }
  }, [isOpen, editingProject]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMember = (userId: string) => {
    const member = allMembers.find(m => m.id === userId);
    if (!member) return;

    const currentMembers = formData.members || [];
    const exists = currentMembers.find(m => m.id === userId);

    if (exists) {
      setFormData(prev => ({
        ...prev,
        members: currentMembers.filter(m => m.id !== userId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        members: [...currentMembers, member]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const finalProject: Project = {
        id: editingProject?.id || `p${Date.now()}`,
        name: formData.name!,
        description: formData.description || '',
        status: formData.status as any,
        progress: formData.progress || 0,
        members: formData.members || [],
        tasks: editingProject?.tasks || [],
        dueDate: formData.dueDate || new Date().toISOString(),
        image: formData.image
    };

    onSave(finalProject);
    onClose();
  };

  // Prepare Dropdown Options
  const statusOptions: DropdownOption[] = [
    { value: 'Active', label: 'Active', icon: <span className="w-2 h-2 rounded-full bg-green-500"/> },
    { value: 'Completed', label: 'Completed', icon: <span className="w-2 h-2 rounded-full bg-blue-500"/> },
    { value: 'On Hold', label: 'On Hold', icon: <span className="w-2 h-2 rounded-full bg-orange-500"/> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-dark-lighter w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
             {editingProject ? 'Edit Project' : 'New Project'}
          </h3>
          <div className="flex gap-2">
             {editingProject && onDelete && (
                <button onClick={() => onDelete(editingProject.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Project">
                    <Trash2 className="w-5 h-5" />
                </button>
             )}
             <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Cover Image */}
          <div className="relative group rounded-2xl overflow-hidden h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
             {formData.image ? (
                <img src={formData.image} alt="Cover" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
             ) : (
                <div className="text-center text-gray-400">
                    <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <span className="text-sm">Upload Cover Image</span>
                </div>
             )}
             <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 cursor-pointer opacity-0"
             />
             <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                Change Image
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Project Name</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white transition-all"
                  placeholder="e.g. AI Marketing Campaign"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
              <CustomDropdown 
                options={statusOptions}
                value={formData.status || 'Active'}
                onChange={(val) => setFormData({...formData, status: val as any})}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  required
                  value={formData.dueDate?.split('T')[0]}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white h-[46px]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none h-24 resize-none dark:text-white"
                placeholder="Brief project summary..."
              />
            </div>

            {/* Team Selection */}
            <div className="col-span-1 md:col-span-2">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Team Members & Roles</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {allMembers.map(user => {
                      const isSelected = formData.members?.find(m => m.id === user.id);
                      return (
                        <div 
                            key={user.id}
                            onClick={() => toggleMember(user.id)}
                            className={`
                                flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all duration-200
                                ${isSelected 
                                    ? 'bg-primary/5 border-primary shadow-sm' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }
                            `}
                        >
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>{user.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{user.jobTitle || user.role}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                {isSelected && <Save className="w-3 h-3 text-white" />} 
                            </div>
                        </div>
                      );
                  })}
               </div>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
            <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;