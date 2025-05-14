
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { categories, addCategory } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { signOut } = useAuth();

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  // Store the selected category in sessionStorage to persist between page loads
  useEffect(() => {
    // Update session storage when category changes
    sessionStorage.setItem('selectedCategory', selectedCategory);
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('categoryChanged', { 
      detail: { category: selectedCategory } 
    }));
  }, [selectedCategory]);

  // Load the selected category from sessionStorage on initial render
  useEffect(() => {
    const savedCategory = sessionStorage.getItem('selectedCategory');
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }
  }, []);

  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground w-64 p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-6">TaskMaster</h1>
      
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-2 text-sidebar-foreground/70">CATEGORIES</h2>
        <nav>
          {categories.map((category) => (
            <div 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "mb-1 py-2 px-3 rounded-md cursor-pointer transition-colors",
                selectedCategory === category 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {category}
            </div>
          ))}
        </nav>
      </div>

      {showAddCategory ? (
        <div className="mt-2 flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
            className="bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder-sidebar-foreground/50"
          />
          <Button 
            onClick={handleAddCategory} 
            size="sm" 
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
          >
            Add
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setShowAddCategory(true)}
          variant="ghost"
          className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </Button>
      )}

      <div className="mt-auto flex flex-col gap-2">
        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
        
        <div className="text-xs text-sidebar-foreground/50">
          TaskMaster v1.0.0
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
