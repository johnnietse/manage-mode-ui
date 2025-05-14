
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  reminderDate?: string | null;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface TaskContextType {
  tasks: Task[];
  categories: string[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  filteredTasks: (category: string) => Task[];
  getTotalTasksByCategory: () => Record<string, number>;
  getCompletedTasksByCategory: () => Record<string, number>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch tasks and categories when the user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCategories();
    } else {
      setTasks([]);
      setCategories(['All']);
    }
  }, [user]);

  // Check for reminders every minute
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const checkReminders = () => {
      const now = new Date();
      const tasksDueWithinFiveMinutes = tasks.filter(task => {
        if (!task.reminderDate || task.completed) return false;
        
        const reminderDate = new Date(task.reminderDate);
        const diffInMinutes = (reminderDate.getTime() - now.getTime()) / (1000 * 60);
        return diffInMinutes >= 0 && diffInMinutes <= 5;
      });
      
      tasksDueWithinFiveMinutes.forEach(task => {
        toast({
          title: "Reminder",
          description: `Task "${task.title}" is due soon!`,
        });
      });
    };

    // Check immediately and then set interval
    checkReminders();
    const intervalId = setInterval(checkReminders, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [tasks]);

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Convert to our Task format
      const formattedTasks: Task[] = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        dueDate: task.due_date,
        category: task.category,
        priority: task.priority as 'low' | 'medium' | 'high',
        completed: task.completed,
        reminderDate: task.reminder_date || null,
        recurrence: task.recurrence || 'none',
      }));

      setTasks(formattedTasks);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on category
  const filteredTasks = (category: string) => {
    if (category === 'All') {
      return tasks;
    }
    return tasks.filter(task => task.category === category);
  };

  // Get statistics on total tasks by category
  const getTotalTasksByCategory = () => {
    return categories
      .filter(category => category !== 'All')
      .reduce((acc, category) => {
        acc[category] = tasks.filter(task => task.category === category).length;
        return acc;
      }, {} as Record<string, number>);
  };

  // Get statistics on completed tasks by category
  const getCompletedTasksByCategory = () => {
    return categories
      .filter(category => category !== 'All')
      .reduce((acc, category) => {
        acc[category] = tasks.filter(task => task.category === category && task.completed).length;
        return acc;
      }, {} as Record<string, number>);
  };

  // Check for recurring tasks that need to be regenerated
  useEffect(() => {
    if (tasks.length === 0) return;

    const regenerateRecurringTasks = async () => {
      const today = new Date();
      const completedRecurringTasks = tasks.filter(task => {
        if (!task.recurrence || task.recurrence === 'none' || !task.completed) return false;
        
        const dueDate = new Date(task.dueDate);
        return dueDate < today; // Task is past due and completed
      });
      
      for (const task of completedRecurringTasks) {
        let newDueDate = new Date(task.dueDate);
        
        switch (task.recurrence) {
          case 'daily':
            newDueDate.setDate(newDueDate.getDate() + 1);
            break;
          case 'weekly':
            newDueDate.setDate(newDueDate.getDate() + 7);
            break;
          case 'monthly':
            newDueDate.setMonth(newDueDate.getMonth() + 1);
            break;
          case 'yearly':
            newDueDate.setFullYear(newDueDate.getFullYear() + 1);
            break;
        }
        
        // Create new task as a duplicate with updated due date
        const newTask: Omit<Task, 'id'> = {
          title: task.title,
          description: task.description,
          dueDate: newDueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          category: task.category,
          priority: task.priority as 'low' | 'medium' | 'high',
          completed: false,
          reminderDate: task.reminderDate,
          recurrence: task.recurrence,
        };
        
        // Create the new task in the database
        await addTask(newTask);
        // Mark the existing task as no longer recurring to prevent duplication
        await updateTask({ ...task, recurrence: 'none' });
      }
    };
    
    regenerateRecurringTasks();
  }, [tasks]);

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name');
      
      if (error) throw error;
      
      setCategories(['All', ...data.map(cat => cat.name)]);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
      console.error('Error fetching categories:', error);
    }
  };

  // Add a new task
  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add tasks",
          variant: "destructive",
        });
        return;
      }

      // Convert to database format
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          due_date: task.dueDate,
          category: task.category,
          priority: task.priority,
          completed: task.completed,
          user_id: user.id,
          reminder_date: task.reminderDate || null,
          recurrence: task.recurrence || 'none',
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Convert back to our Task format and add to state
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        dueDate: data.due_date,
        category: data.category,
        priority: data.priority as 'low' | 'medium' | 'high',
        completed: data.completed,
        reminderDate: data.reminder_date || null,
        recurrence: data.recurrence || 'none',
      };
      
      setTasks([...tasks, newTask]);
      
      toast({
        title: "Task added",
        description: `${task.title} has been added`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update an existing task
  const updateTask = async (updatedTask: Task) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to update tasks",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          due_date: updatedTask.dueDate,
          category: updatedTask.category,
          priority: updatedTask.priority,
          completed: updatedTask.completed,
          reminder_date: updatedTask.reminderDate || null,
          recurrence: updatedTask.recurrence || 'none',
        })
        .eq('id', updatedTask.id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      
      toast({
        title: "Task updated",
        description: `${updatedTask.title} has been updated`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete tasks",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.filter(task => task.id !== id));
      
      toast({
        title: "Task deleted",
        description: "Task has been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Add a new category
  const addCategory = async (categoryName: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add categories",
          variant: "destructive",
        });
        return;
      }
      
      if (categories.includes(categoryName)) {
        toast({
          title: "Category exists",
          description: "This category already exists",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          user_id: user.id
        });
        
      if (error) throw error;
      
      // Update local state
      setCategories([...categories, categoryName]);
      
      toast({
        title: "Category added",
        description: `${categoryName} has been added`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to update tasks",
          variant: "destructive",
        });
        return;
      }
      
      // Find the task to update
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;
      
      const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
      
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: updatedTask.completed })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      loading,
      addTask,
      updateTask,
      deleteTask,
      addCategory,
      toggleTaskCompletion,
      filteredTasks,
      getTotalTasksByCategory,
      getCompletedTasksByCategory,
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
