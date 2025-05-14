
import React from 'react';
import { Task } from '@/context/TaskContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

const getPriorityClass = (priority: string) => {
  switch(priority) {
    case 'low':
      return 'task-priority-low';
    case 'medium':
      return 'task-priority-medium';
    case 'high':
      return 'task-priority-high';
    default:
      return '';
  }
};

const TaskCard = ({ task, onToggleComplete }: TaskCardProps) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const priorityClass = getPriorityClass(task.priority);

  return (
    <Card className={cn(
      "mb-3 p-4 hover:shadow-lg transition-all duration-300 ease-in-out hover-lift",
      priorityClass,
      task.completed && "opacity-70"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className={cn(
            "text-lg font-medium transition-all duration-300",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="flex mt-2 items-center gap-2 flex-wrap">
            <div className="flex items-center text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded gap-1">
              <Tag size={12} />
              <span>{task.category}</span>
            </div>
            
            <div className={cn(
              "flex items-center text-xs px-2 py-1 rounded gap-1",
              isOverdue ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" : 
                         "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            )}>
              <Calendar size={12} />
              <span>{isOverdue ? 'Overdue' : format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
            
            {task.reminderDate && (
              <div className="flex items-center text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded gap-1">
                <Clock size={12} />
                <span>Reminder: {format(new Date(task.reminderDate), 'MMM d')}</span>
              </div>
            )}
            
            {task.recurrence && task.recurrence !== 'none' && (
              <div className="flex items-center text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>{task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
