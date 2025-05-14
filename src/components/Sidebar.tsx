
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LogOut, CheckSquare2, Calendar, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  onViewChange: (view: 'list' | 'calendar' | 'stats') => void;
  currentView: 'list' | 'calendar' | 'stats';
}

const Sidebar = ({ onViewChange, currentView }: SidebarProps) => {
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

  const NavItem = ({ 
    icon: Icon, 
    label, 
    onClick, 
    isActive = false 
  }: { 
    icon: React.ElementType, 
    label: string, 
    onClick?: () => void,
    isActive?: boolean
  }) => (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "flex w-full items-center justify-start gap-2 transition-all duration-300",
        isActive 
          ? "text-sidebar-foreground bg-sidebar-accent shadow-md" 
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Button>
  );

  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground w-64 flex flex-col shadow-xl transition-all duration-500 ease-in-out">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold flex items-center gap-2 fade-in animate-fade-in">
          <CheckSquare2 size={20} />
          TaskMaster
        </h1>
      </div>
      
      <div className="p-4 fade-in animate-fade-in animation-delay-100">
        <h2 className="text-sm font-medium mb-4 text-sidebar-foreground/70 uppercase tracking-wider">Dashboard</h2>
        <nav className="space-y-1">
          <NavItem 
            icon={CheckSquare2} 
            label="Tasks" 
            onClick={() => onViewChange('list')} 
            isActive={currentView === 'list'}
          />
          <NavItem 
            icon={Calendar} 
            label="Calendar" 
            onClick={() => onViewChange('calendar')} 
            isActive={currentView === 'calendar'}
          />
          <NavItem 
            icon={BarChart2} 
            label="Analytics" 
            onClick={() => onViewChange('stats')} 
            isActive={currentView === 'stats'}
          />
          <NavItem icon={Settings} label="Settings" />
        </nav>
      </div>
      
      <div className="p-4 flex-1 fade-in animate-fade-in animation-delay-200">
        <h2 className="text-sm font-medium mb-4 text-sidebar-foreground/70 uppercase tracking-wider flex justify-between items-center">
          Categories
          {!showAddCategory && (
            <Button
              onClick={() => setShowAddCategory(true)}
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-sidebar-accent/50"
            >
              <Plus size={14} />
            </Button>
          )}
        </h2>
        
        <nav className="space-y-1">
          {categories.map((category, index) => (
            <div 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "mb-1 py-2 px-3 rounded-md cursor-pointer transition-all duration-300",
                "fade-in animate-fade-in",
                selectedCategory === category 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50",
                { "animation-delay-100": index < 3, "animation-delay-200": index >= 3 && index < 6, "animation-delay-300": index >= 6 }
              )}
            >
              {category}
            </div>
          ))}
        </nav>

        {showAddCategory && (
          <div className="mt-2 flex gap-2 fade-in animate-fade-in">
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
        )}
      </div>

      <div className="mt-auto p-4 border-t border-sidebar-border fade-in animate-fade-in animation-delay-300">
        <Button
          onClick={() => signOut()}
          variant="ghost"
          className="flex w-full items-center justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
        
        <div className="text-xs text-sidebar-foreground/50 mt-4 text-center">
          TaskMaster v1.0.0
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
