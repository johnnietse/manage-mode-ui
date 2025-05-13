
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, List } from 'lucide-react';

interface HeaderProps {
  view: 'list' | 'calendar';
  setView: (view: 'list' | 'calendar') => void;
  onNewTask: () => void;
}

const Header = ({ view, setView, onNewTask }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center p-6 border-b">
      <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={16} />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar size={16} />
            Calendar View
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button onClick={onNewTask} className="flex items-center gap-2">
        <Plus size={16} />
        New Task
      </Button>
    </div>
  );
};

export default Header;
