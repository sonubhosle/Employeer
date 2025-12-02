import { User, UserRole, Project, TaskStatus, Priority, Notification } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Morgan',
  email: 'alex.morgan@nexus.com',
  role: UserRole.USER,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  gender: 'Male',
  joinedDate: '2023-01-15',
  projectsJoined: 3,
  dob: '1995-05-20',
  experience: '4 years',
  jobTitle: 'Senior Frontend Dev'
};

export const ADMIN_USER: User = {
  id: 'a1',
  name: 'Sarah Connor',
  email: 'sarah.c@nexus.com',
  role: UserRole.ADMIN,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  gender: 'Female',
  joinedDate: '2022-11-01',
  projectsJoined: 12,
  dob: '1988-08-15',
  experience: '8 years',
  jobTitle: 'Product Manager'
};

export const TEAM_MEMBERS: User[] = [
  CURRENT_USER,
  ADMIN_USER,
  { 
    id: 'u2', 
    name: 'John Doe', 
    email: 'john@nexus.com', 
    role: UserRole.USER, 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80',
    gender: 'Male',
    joinedDate: '2023-03-10',
    projectsJoined: 2,
    dob: '1998-02-10',
    experience: '2 years',
    jobTitle: 'Java Developer'
  },
  { 
    id: 'u3', 
    name: 'Jane Smith', 
    email: 'jane@nexus.com', 
    role: UserRole.USER, 
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    gender: 'Female',
    joinedDate: '2023-05-22',
    projectsJoined: 4,
    dob: '1992-12-05',
    experience: '5 years',
    jobTitle: 'UI/UX Designer'
  },
  { 
    id: 'u4', 
    name: 'Mike Chen', 
    email: 'mike@nexus.com', 
    role: UserRole.USER, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    gender: 'Male',
    joinedDate: '2023-06-01',
    projectsJoined: 1,
    dob: '1999-04-15',
    experience: '1 year',
    jobTitle: 'Python Developer'
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhaul the corporate website with new branding and modern tech stack.',
    status: 'Active',
    progress: 75,
    members: [CURRENT_USER, TEAM_MEMBERS[2]],
    dueDate: '2023-12-01',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    tasks: [
      { id: 't1', title: 'Design Homepage', description: 'Create figma mockups', status: TaskStatus.DONE, priority: Priority.HIGH, dueDate: '2023-10-15', assignee: CURRENT_USER, image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=300&q=80' },
      { id: 't2', title: 'Implement React Components', description: 'Build shared UI lib', status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, dueDate: '2023-11-01', assignee: TEAM_MEMBERS[2] },
    ]
  },
  {
    id: 'p2',
    name: 'Mobile App Launch',
    description: 'Prepare for iOS and Android release Q4 including marketing materials.',
    status: 'Active',
    progress: 40,
    members: [CURRENT_USER, TEAM_MEMBERS[3], ADMIN_USER],
    dueDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=500&q=80',
    tasks: []
  },
  {
    id: 'p3',
    name: 'Internal Audit',
    description: 'Q3 Financial security audit and compliance checks.',
    status: 'On Hold',
    progress: 10,
    members: [ADMIN_USER],
    dueDate: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80',
    tasks: []
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Task Assigned', message: 'You have been assigned to "Homepage Hero"', time: '2 min ago', read: false, type: 'info' },
  { id: 'n2', title: 'Project Update', message: 'Mobile App Launch is now 40% complete', time: '1 hour ago', read: false, type: 'success' },
  { id: 'n3', title: 'Meeting Reminder', message: 'Team sync in 15 minutes', time: '2 hours ago', read: true, type: 'warning' },
];