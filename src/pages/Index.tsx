
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';
import TaskModal from '@/components/TaskModal';
import AuthForms from '@/components/AuthForms';
import TaskStatistics from '@/components/TaskStatistics';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [view, setView] = useState<'list' | 'calendar' | 'stats'>('list');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthForms />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar onViewChange={setView} currentView={view} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          view={view} 
          setView={setView} 
          onNewTask={() => setIsTaskModalOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'list' ? (
            <TaskList />
          ) : view === 'calendar' ? (
            <CalendarView />
          ) : (
            <TaskStatistics />
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
