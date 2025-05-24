
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, ListIcon, CalendarIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import gsap from 'gsap';

interface HeaderProps {
  view: 'list' | 'calendar' | 'stats';
  setView: (view: 'list' | 'calendar' | 'stats') => void;
  onNewTask: () => void;
}

const Header = ({ view, setView, onNewTask }: HeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const newTaskButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const newTaskButton = newTaskButtonRef.current;

    if (header) {
      // Initial header animation
      gsap.fromTo(header,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    if (newTaskButton) {
      const handleNewTaskHover = () => {
        gsap.to(newTaskButton, {
          scale: 1.05,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
        gsap.to(newTaskButton.querySelector('.plus-icon'), {
          rotation: 90,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      };

      const handleNewTaskLeave = () => {
        gsap.to(newTaskButton, {
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
        gsap.to(newTaskButton.querySelector('.plus-icon'), {
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
      };

      const handleNewTaskClick = () => {
        gsap.to(newTaskButton, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      };

      newTaskButton.addEventListener('mouseenter', handleNewTaskHover);
      newTaskButton.addEventListener('mouseleave', handleNewTaskLeave);
      newTaskButton.addEventListener('click', handleNewTaskClick);

      return () => {
        newTaskButton.removeEventListener('mouseenter', handleNewTaskHover);
        newTaskButton.removeEventListener('mouseleave', handleNewTaskLeave);
        newTaskButton.removeEventListener('click', handleNewTaskClick);
      };
    }
  }, []);

  const handleViewChange = (newView: 'list' | 'calendar' | 'stats') => {
    setView(newView);
  };

  const handleNewTaskClick = () => {
    onNewTask();
  };

  return (
    <header ref={headerRef} className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('list')}
        >
          <ListIcon className="h-4 w-4 mr-1" />
          List
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('calendar')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Calendar
        </Button>
        <Button
          variant={view === 'stats' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('stats')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Statistics
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <Button ref={newTaskButtonRef} onClick={handleNewTaskClick}>
          <PlusIcon className="h-4 w-4 mr-1 plus-icon" />
          New Task
        </Button>
      </div>
    </header>
  );
};

export default Header;
