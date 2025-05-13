
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import SidebarContent from './SidebarContent';

const Sidebar = () => {
  const { categories, addCategory } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    // We'll pass this category to the TaskList component via context or props
    // This will be used to filter tasks
  };

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };

  return (
    <div className="h-screen w-64 flex flex-col" style={{ backgroundColor: '#6366f1' }}>
      <SidebarContent 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory}
        onAddCategory={handleAddCategoryClick}
      />
      
      {showAddCategory && (
        <div className="px-3 py-2 flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="bg-indigo-500 border-indigo-400 text-white placeholder-indigo-200"
          />
          <Button 
            onClick={handleAddCategory} 
            size="sm" 
            className="bg-white text-indigo-600 hover:bg-indigo-100"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
