
import React, { createContext, useState, useContext } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  categories: string[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: string) => void;
  toggleTaskCompletion: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the draft and send it for review',
    dueDate: '2025-05-15',
    category: 'Work',
    priority: 'high',
    completed: false,
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits',
    dueDate: '2025-05-14',
    category: 'Personal',
    priority: 'medium',
    completed: false,
  },
  {
    id: '3',
    title: 'Schedule doctor appointment',
    description: 'Annual checkup',
    dueDate: '2025-05-20',
    category: 'Health',
    priority: 'low',
    completed: true,
  },
  {
    id: '4',
    title: 'Prepare for meeting',
    description: 'Review documents and prepare presentation',
    dueDate: '2025-05-13',
    category: 'Work',
    priority: 'high',
    completed: false,
  },
  {
    id: '5',
    title: 'Call mom',
    description: 'Check how she\'s doing',
    dueDate: '2025-05-14',
    category: 'Personal',
    priority: 'medium',
    completed: false,
  },
];

const initialCategories = ['All', 'Work', 'Personal', 'Health'];

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      addTask,
      updateTask,
      deleteTask,
      addCategory,
      toggleTaskCompletion,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
