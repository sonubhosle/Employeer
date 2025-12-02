export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  gender: Gender;
  joinedDate: string;
  projectsJoined: number;
  dob?: string;
  experience?: string;
  jobTitle?: string; // New field for "Web Developer", "Java Dev", etc.
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  dueDate: string;
  image?: string; // URL or Base64
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
  members: User[];
  tasks: Task[];
  dueDate: string;
  image?: string; // New field for Project Cover Image
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
  channel?: 'team' | 'admin';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}