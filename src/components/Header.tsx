
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, ListIcon, CalendarIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  view: 'list' | 'calendar' | 'stats';
  setView: (view: 'list' | 'calendar' | 'stats') => void;
  onNewTask: () => void;
}

const Header = ({ view, setView, onNewTask }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('list')}
        >
          <ListIcon className="h-4 w-4 mr-1" />
          List
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('calendar')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Calendar
        </Button>
        <Button
          variant={view === 'stats' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setView('stats')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Statistics
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button onClick={onNewTask}>
          <PlusIcon className="h-4 w-4 mr-1" />
          New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
