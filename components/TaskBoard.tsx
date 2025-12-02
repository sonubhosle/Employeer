import React, { useState } from 'react';
import { Task, TaskStatus, Priority } from '../types';
import { Plus, Wand2, Clock, AlertCircle, CheckCircle2, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { generateTaskDescription } from '../services/geminiService';

interface TaskBoardProps {
  tasks: Task[];
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  // Update tasks when props change
  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case Priority.HIGH: return {
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-100 dark:border-red-900/30',
          bar: 'bg-red-500',
          icon: <ArrowUp className="w-3 h-3 mr-1" strokeWidth={3} />
      };
      case Priority.MEDIUM: return {
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-100 dark:border-orange-900/30',
          bar: 'bg-orange-500',
          icon: <ArrowRight className="w-3 h-3 mr-1" strokeWidth={3} />
      };
      case Priority.LOW: return {
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-100 dark:border-blue-900/30',
          bar: 'bg-blue-500',
          icon: <ArrowDown className="w-3 h-3 mr-1" strokeWidth={3} />
      };
      default: return {
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-100',
          bar: 'bg-gray-400',
          icon: <div className="w-3 h-3 mr-1" />
      };
    }
  };

  const handleCreateTaskWithAI = async () => {
    const title = prompt("Enter task title for AI generation:");
    if (!title) return;

    setLoadingAI(true);
    const description = await generateTaskDescription(title);
    setLoadingAI(false);

    const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        dueDate: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleQuickAdd = (status: TaskStatus) => {
      const title = prompt(`Quick add task to ${status}:`);
      if (title) {
          setTasks([...tasks, { 
              id: Date.now().toString(), 
              title, 
              description: 'Needs description...', 
              status, 
              priority: Priority.MEDIUM, 
              dueDate: new Date().toISOString() 
          }]);
      }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setActiveDragId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
        setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
      setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== status) {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, status } : t
        );
        setTasks(updatedTasks);
    }
    setActiveDragId(null);
  };

  const updateTaskDate = (taskId: string, newDate: string) => {
    const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, dueDate: newDate } : t
    );
    setTasks(updatedTasks);
  };

  const columns = Object.values(TaskStatus);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Task Board</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Drag and drop to manage workflow</p>
        </div>
        <button 
          onClick={handleCreateTaskWithAI}
          disabled={loadingAI}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
        >
          {loadingAI ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {loadingAI ? 'Generating...' : 'AI Assist'}
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[1200px] h-full">
          {columns.map(status => (
            <div 
                key={status} 
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
                className={`
                    flex-1 min-w-[300px] rounded-2xl p-4 flex flex-col border backdrop-blur-sm transition-colors duration-300
                    ${dragOverColumn === status 
                        ? 'bg-primary/5 border-primary border-dashed dark:bg-primary/10' 
                        : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-700/50'
                    }
                `}
            >
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === TaskStatus.DONE ? 'bg-green-500' : status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{status}</span>
                </div>
                <span className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {tasks.filter(t => t.status === status).map(task => {
                    const isDone = task.status === TaskStatus.DONE;
                    const priorityStyle = getPriorityStyles(task.priority);
                    
                    return (
                        <div 
                            key={task.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className={`
                                bg-white dark:bg-dark-lighter p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 
                                hover:shadow-lg hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden
                                ${activeDragId === task.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                                ${isDone ? 'animate-in zoom-in-95 duration-300' : ''}
                            `}
                        >
                            {/* Done Animation Overlay */}
                            {isDone && (
                                <div className="absolute inset-0 bg-green-500/5 pointer-events-none z-0 animate-in fade-in duration-700"></div>
                            )}

                            {/* Left highlight strip with Priority Color */}
                            <div className={`absolute top-0 left-0 w-1 h-full transition-all ${isDone ? 'bg-green-500' : priorityStyle.bar}`}></div>
                            
                            {task.image && (
                                <div className="mb-3 rounded-lg overflow-hidden h-32 w-full relative z-10">
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                    <img src={task.image} alt="Task attachment" className="w-full h-full object-cover" />
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center mb-2 relative z-10">
                                <span className={`flex items-center text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${priorityStyle.bg} ${priorityStyle.color} ${priorityStyle.border}`}>
                                    {priorityStyle.icon}
                                    {task.priority}
                                </span>
                                {isDone ? (
                                    <div className="text-green-500 bg-green-50 dark:bg-green-900/30 p-1 rounded-full animate-in zoom-in spin-in-180 duration-500">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                ) : (
                                    task.priority === Priority.HIGH && <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
                                )}
                            </div>

                            <h4 className={`font-bold mb-1 leading-snug relative z-10 flex items-start gap-2 ${isDone ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                                <span className={`mt-1.5 w-2 h-2 rounded-full ${priorityStyle.bar} flex-shrink-0`} title={`Priority: ${task.priority}`}></span>
                                <span>{task.title}</span>
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 relative z-10">{task.description}</p>
                            
                            <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-gray-700/50 relative z-10">
                            <div className="flex items-center text-gray-400 text-xs relative group/date hover:text-primary transition-colors">
                                <Clock className="w-3.5 h-3.5 absolute left-0 pointer-events-none" />
                                <input 
                                    type="date"
                                    value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => updateTaskDate(task.id, e.target.value)}
                                    className="bg-transparent border-none text-xs text-inherit focus:outline-none focus:text-primary pl-5 py-0 w-[110px] cursor-pointer rounded"
                                />
                            </div>
                            <div className="flex -space-x-1">
                                {task.assignee ? (
                                    <img 
                                        src={task.assignee.avatar} 
                                        alt={task.assignee.name} 
                                        className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-dark-lighter"
                                        title={task.assignee.name}
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] text-gray-500">?</div>
                                )}
                            </div>
                            </div>
                        </div>
                    );
                })}
                
                <button 
                    onClick={() => handleQuickAdd(status)}
                    className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-xl text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;