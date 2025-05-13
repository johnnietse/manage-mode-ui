
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  CheckSquareIcon, 
  BarChartIcon,
  Settings2Icon,
  PlusCircleIcon
} from 'lucide-react';
import UserProfile from './UserProfile';
import { useTaskContext } from '@/context/TaskContext';

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

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Overview
        </h2>
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <CheckSquareIcon className="mr-2 h-4 w-4" />
            My Tasks
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <BarChartIcon className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            Categories
          </h2>
          <Button 
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAddCategory}
          >
            <PlusCircleIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                selectedCategory === category && "font-medium"
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
          className="w-full justify-start"
        >
          <Settings2Icon className="mr-2 h-4 w-4" />
          Settings
        </Button>

        <UserProfile />
      </div>
    </div>
  );
};

export default SidebarContent;
