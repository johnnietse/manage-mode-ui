
import React from 'react';
import { Button } from '@/components/ui/button';
import { ListIcon, CalendarIcon, BarChart2Icon, PlusIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  view: 'list' | 'calendar' | 'stats';
  setView: (view: 'list' | 'calendar' | 'stats') => void;
  onNewTask: () => void;
}

const HeaderButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <Button
    variant={active ? 'default' : 'outline'}
    size="sm"
    onClick={onClick}
    className={cn(
      "relative transition-all duration-300 overflow-hidden",
      active ? "shadow-md" : "shadow-sm"
    )}
  >
    {children}
  </Button>
);

const Header = ({ view, setView, onNewTask }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4 border-b backdrop-blur-sm bg-background/80 sticky top-0 z-10 transition-all duration-300">
      <div className="flex items-center space-x-2 slide-in-left animate-slide-in">
        <HeaderButton 
          active={view === 'list'} 
          onClick={() => setView('list')}
        >
          <ListIcon className="h-4 w-4 mr-1" />
          List
        </HeaderButton>
        <HeaderButton 
          active={view === 'calendar'} 
          onClick={() => setView('calendar')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Calendar
        </HeaderButton>
        <HeaderButton 
          active={view === 'stats'} 
          onClick={() => setView('stats')}
        >
          <BarChart2Icon className="h-4 w-4 mr-1" />
          Statistics
        </HeaderButton>
      </div>
      
      <div className="flex items-center space-x-2 slide-in-right animate-slide-in">
        <ThemeToggle />
        <Button 
          onClick={onNewTask}
          className="shadow-md hover:shadow-lg transition-all duration-300"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
