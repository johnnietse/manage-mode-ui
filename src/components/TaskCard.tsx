
import React from 'react';
import { Task } from '@/context/TaskContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
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

const TaskCard = ({ task, onToggleComplete, onDelete }: TaskCardProps) => {
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(task.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default TaskCard;
