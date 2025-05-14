
import React from 'react';
import { Task } from '@/context/TaskContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
      "mb-3 p-4 hover:shadow-md transition-shadow animate-fade-in",
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
            "text-lg font-medium",
            task.completed && "line-through text-gray-500"
          )}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="flex mt-2 items-center gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {task.category}
            </span>
            <span className={cn(
              "text-xs px-2 py-1 rounded",
              isOverdue ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
            )}>
              {isOverdue ? 'Overdue' : format(new Date(task.dueDate), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
