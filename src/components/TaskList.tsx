
import React, { useState, useEffect } from 'react';
import { useTaskContext, Task } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TaskList = () => {
  const { toggleTaskCompletion, deleteTask, filteredTasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Listen for category changes from Sidebar
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setSelectedCategory(event.detail.category);
    };
    
    // Get initial category from sessionStorage
    const savedCategory = sessionStorage.getItem('selectedCategory');
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
    
    // Add event listener for category changes
    window.addEventListener('categoryChanged', handleCategoryChange as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('categoryChanged', handleCategoryChange as EventListener);
    };
  }, []);

  // Get tasks for the selected category
  const categoryTasks = filteredTasks(selectedCategory);

  // Further filter and sort tasks
  const tasksToDisplay = categoryTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const sortedTasks = [...tasksToDisplay].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">
        {selectedCategory === 'All' ? 'All Tasks' : `${selectedCategory} Tasks`}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        
        <div className="flex gap-4">
          <div className="w-40">
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select onValueChange={setFilterPriority} defaultValue={filterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Filter priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleComplete={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No tasks found. Add a new task or adjust your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
