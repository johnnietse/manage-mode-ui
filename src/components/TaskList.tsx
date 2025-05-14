
import React, { useState, useEffect } from 'react';
import { useTaskContext, Task } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const TaskList = () => {
  const { toggleTaskCompletion, filteredTasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
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
      <h2 className="text-2xl font-bold mb-6 slide-in-left animate-slide-in">
        {selectedCategory === 'All' ? 'All Tasks' : `${selectedCategory} Tasks`}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative md:w-1/2 slide-in-left animate-slide-in animation-delay-100">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-all duration-300 border-gray-300 focus:border-primary"
          />
        </div>
        
        <div className="flex gap-4 md:ml-auto slide-in-right animate-slide-in animation-delay-100">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <SlidersHorizontal size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-sm slide-in-left animate-slide-in animation-delay-200">
          <div className="w-40">
            <label className="text-xs text-gray-500 mb-1 block">Sort by</label>
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger className="focus:ring-primary">
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
            <label className="text-xs text-gray-500 mb-1 block">Priority</label>
            <Select onValueChange={setFilterPriority} defaultValue={filterPriority}>
              <SelectTrigger className="focus:ring-primary">
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
      )}

      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <div 
              key={task.id} 
              className={cn(
                "transition-all duration-500 ease-out transform",
                "fade-in animate-fade-in",
                { 
                  "animation-delay-100": index % 3 === 0,
                  "animation-delay-200": index % 3 === 1,
                  "animation-delay-300": index % 3 === 2
                }
              )}
            >
              <TaskCard 
                task={task} 
                onToggleComplete={toggleTaskCompletion} 
              />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 fade-in animate-fade-in">
            No tasks found. Add a new task or adjust your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
