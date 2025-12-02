import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Moon, 
  Sun, 
  Crown,
  ChevronDown
} from 'lucide-react';
import { Notification, User } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notifications: Notification[];
  user: User;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleTheme, notifications, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-lighter/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Brand/Search */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 w-64 lg:w-96 transition-all focus-within:ring-2 focus-within:ring-primary/50">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks, projects, people..." 
              className="bg-transparent border-none outline-none text-sm ml-3 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
            {/* Pro Button */}
            <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20 transform hover:scale-105 transition-all">
                <Crown className="w-3 h-3" />
                UPGRADE PRO
            </button>

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 relative"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    )}
                </button>
                
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-lighter rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Notifications</h3>
                            <button className="text-xs text-primary hover:underline">Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notif.title}</p>
                                            <span className="text-[10px] text-gray-400">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{notif.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Hi, {user.name.split(' ')[0]}</span>
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                 {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-lighter rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Your Profile</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Account Settings</a>
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;