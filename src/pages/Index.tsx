
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';
import TaskModal from '@/components/TaskModal';

const Index = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          view={view} 
          setView={setView} 
          onNewTask={() => setIsTaskModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto">
          {view === 'list' ? (
            <TaskList />
          ) : (
            <CalendarView />
          )}
        </main>
      </div>
      
      <TaskModal 
        open={isTaskModalOpen} 
        onOpenChange={setIsTaskModalOpen}
      />
    </div>
  );
};

export default Index;
