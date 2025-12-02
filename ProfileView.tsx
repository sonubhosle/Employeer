import React from 'react';
import { User, UserRole } from './types';
import { Mail, Calendar, Briefcase, User as UserIcon, Award, Shield } from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-white dark:bg-dark-lighter rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-32 h-32 rounded-3xl border-4 border-white dark:border-dark-lighter shadow-lg object-cover"
          />
          <div className="flex-1 mb-2">
             <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                 {user.role === UserRole.ADMIN && <Shield className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
             </div>
             <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {user.email}
             </p>
          </div>
          <div className="mb-4 flex gap-3">
             <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/30">Edit Profile</button>
             <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">Share</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">Personal Details</h3>
              <ul className="space-y-4">
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><UserIcon className="w-4 h-4" /> Gender</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{user.gender}</span>
                 </li>
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{user.joinedDate}</span>
                 </li>
                 <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Role</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                        {user.role}
                    </span>
                 </li>
              </ul>
           </div>
        </div>

        {/* Stats Column */}
        <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Projects Joined</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{user.projectsJoined}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tasks Completed</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">124</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Performance</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">On-time Completion</span>
                            <span className="text-gray-800 dark:text-white font-bold">92%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full w-[92%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Team Collaboration</span>
                            <span className="text-gray-800 dark:text-white font-bold">88%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full w-[88%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;