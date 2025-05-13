
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  CheckSquareIcon, 
  BarChartIcon,
  Settings2Icon,
  PlusCircleIcon,
  LogOutIcon
} from 'lucide-react';
import UserProfile from './UserProfile';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';

interface SidebarContentProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddCategory: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddCategory
}) => {
  const { categories } = useTaskContext();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#6366f1' }}>
      <div className="px-3 py-4">
        <h2 className="mb-4 px-4 text-2xl font-semibold tracking-tight text-white">
          TaskMaster
        </h2>
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <CheckSquareIcon className="mr-2 h-4 w-4" />
            My Tasks
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-indigo-600"
          >
            <BarChartIcon className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight text-white">
            CATEGORIES
          </h2>
          <Button 
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-indigo-600"
            onClick={onAddCategory}
          >
            <PlusCircleIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <Button
            key="All"
            variant={selectedCategory === "All" ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start text-white",
              selectedCategory === "All" 
                ? "bg-indigo-500 hover:bg-indigo-600" 
                : "hover:bg-indigo-600"
            )}
            onClick={() => onSelectCategory("All")}
          >
            All
          </Button>
          {categories.filter(category => category !== 'All').map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white",
                selectedCategory === category 
                  ? "bg-indigo-500 hover:bg-indigo-600" 
                  : "hover:bg-indigo-600"
              )}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-indigo-600"
        >
          <Settings2Icon className="mr-2 h-4 w-4" />
          Settings
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-indigo-600 mb-4"
          onClick={handleSignOut}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>

        <UserProfile />
      </div>
    </div>
  );
};

export default SidebarContent;
