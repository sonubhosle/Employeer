import React, { useState } from 'react';
import { UserRole } from './types';
import { Mail, Lock, User as UserIcon, ArrowRight, LayoutDashboard } from 'lucide-react';

interface AuthPageProps {
  onLogin: (role: UserRole, email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth check
    if (email && password) {
      onLogin(role, email);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-4xl w-full bg-white dark:bg-dark-lighter rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Brand / Info */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-indigo-800 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <LayoutDashboard className="w-8 h-8" />
              <h1 className="text-2xl font-bold">NexusTask Pro</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              {isLogin ? "Welcome Back!" : "Join the Future."}
            </h2>
            <p className="text-indigo-100 text-lg leading-relaxed">
              {isLogin 
                ? "Streamline your workflow, collaborate with your team, and achieve your goals with AI-powered project management."
                : "Create an account to start managing projects efficiently with dual dashboards and real-time collaboration tools."
              }
            </p>
          </div>
          <div className="relative z-10 mt-12">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <img key={i} src={`https://picsum.photos/100/100?random=${i}`} className="w-10 h-10 rounded-full border-2 border-indigo-500" alt="user" />
               ))}
               <div className="w-10 h-10 rounded-full border-2 border-indigo-500 bg-white/20 flex items-center justify-center text-xs font-bold">+2k</div>
            </div>
            <p className="mt-2 text-sm text-indigo-200">Join thousands of productive teams.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {isLogin ? "Sign In" : "Create Account"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {isLogin ? "Enter your details to access your dashboard." : "Fill in the form to get started."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1">
                   <label className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">Select Role</label>
                   <div className="flex gap-4">
                      <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${role === UserRole.USER ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 dark:text-gray-400'}`}>
                          <input type="radio" name="role" className="hidden" checked={role === UserRole.USER} onChange={() => setRole(UserRole.USER)} />
                          User
                      </label>
                      <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${role === UserRole.ADMIN ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 dark:text-gray-400'}`}>
                          <input type="radio" name="role" className="hidden" checked={role === UserRole.ADMIN} onChange={() => setRole(UserRole.ADMIN)} />
                          Admin
                      </label>
                   </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-primary hover:underline focus:outline-none"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;