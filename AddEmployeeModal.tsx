import React, { useState } from 'react';
import { UserRole, Gender } from './types';
import { X, User as UserIcon, Briefcase, Mail, Calendar, Shield } from 'lucide-react';
import CustomDropdown, { DropdownOption } from './components/CustomDropdown';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employeeData: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [jobTitle, setJobTitle] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [experience, setExperience] = useState('');
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
    if (!name || !email) return;

    onAdd({
      name,
      email,
      role,
      jobTitle,
      dob,
      gender,
      experience,
      avatar: imagePreview || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=150&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
      projectsJoined: 0
    });
    
    // Reset
    setName('');
    setEmail('');
    setRole(UserRole.USER);
    setJobTitle('');
    setDob('');
    setGender('Male');
    setExperience('');
    setImagePreview(null);
    onClose();
  };

  const genderOptions: DropdownOption[] = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];

  const roleOptions: DropdownOption[] = [
    { value: UserRole.USER, label: 'User', icon: <UserIcon className="w-4 h-4"/>, subLabel: 'Standard access' },
    { value: UserRole.ADMIN, label: 'Admin', icon: <Shield className="w-4 h-4"/>, subLabel: 'Full access' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-dark-lighter w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Add New Employee</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          <div className="flex justify-center mb-6">
             <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg bg-gray-100 flex items-center justify-center">
                   {imagePreview ? (
                       <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                       <UserIcon className="w-8 h-8 text-gray-400" />
                   )}
                </div>
                <label 
                    htmlFor="emp-photo-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer text-xs font-bold"
                >
                    Upload
                </label>
                <input type="file" id="emp-photo-upload" accept="image/*" onChange={handleImageChange} className="hidden" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="e.g. Michael Scott" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="name@nexus.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
              <CustomDropdown options={roleOptions} value={role} onChange={(val) => setRole(val as UserRole)} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
              <CustomDropdown options={genderOptions} value={gender} onChange={(val) => setGender(val as Gender)} />
            </div>

             <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="e.g. Senior Java Developer" />
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience</label>
                <input type="text" required value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white" placeholder="e.g. 5 Years" />
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">DOB</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white h-[46px]" />
                </div>
             </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-secondary text-white font-bold py-3 rounded-xl shadow-lg shadow-secondary/30 hover:bg-secondary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;