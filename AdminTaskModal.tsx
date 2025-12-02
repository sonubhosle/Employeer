import React, { useState } from 'react';
import { User, Priority, TaskStatus } from './types';
import { X, Upload, Calendar, Type, FileText } from 'lucide-react';
import CustomDropdown, { DropdownOption } from './components/CustomDropdown';

interface AdminTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (taskData: any) => void;
  members: User[];
}

const AdminTaskModal: React.FC<AdminTaskModalProps> = ({ isOpen, onClose, onAssign, members }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignee = members.find(m => m.id === assigneeId);
    
    onAssign({
      title,
      description: desc,
      dueDate: date,
      assignee,
      priority,
      status: TaskStatus.TODO,
      image: imagePreview
    });
    
    // Reset
    setTitle('');
    setDesc('');
    setDate('');
    setAssigneeId('');
    setImagePreview(null);
    onClose();
  };

  const assigneeOptions: DropdownOption[] = members.map(u => ({
      value: u.id,
      label: u.name,
      avatar: u.avatar,
      subLabel: u.jobTitle || u.role
  }));

  const priorityOptions: DropdownOption[] = Object.values(Priority).map(p => ({
      value: p,
      label: p
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-dark-lighter w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Assign New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Task Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                placeholder="e.g. Update Homepage Hero"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none h-24 resize-none dark:text-white"
                placeholder="Detailed instructions..."
                />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white h-[46px]"
                    />
                </div>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                <CustomDropdown options={priorityOptions} value={priority} onChange={(val) => setPriority(val as Priority)} />
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assign To</label>
             <CustomDropdown 
                options={assigneeOptions} 
                value={assigneeId} 
                onChange={setAssigneeId} 
                placeholder="Select Employee..."
             />
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reference Image</label>
             <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="task-image-upload"
                    />
                    <label 
                        htmlFor="task-image-upload"
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Click to upload</span>
                    </label>
                </div>
                {imagePreview && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
             </div>
          </div>

          <div className="pt-2">
            <button 
                type="submit" 
                className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTaskModal;