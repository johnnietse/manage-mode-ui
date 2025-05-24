
import React, { useRef, useEffect } from 'react';
import { Task } from '@/context/TaskContext';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import gsap from 'gsap';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const priorityClass = getPriorityClass(task.priority);

  useEffect(() => {
    const card = cardRef.current;
    const deleteButton = deleteButtonRef.current;

    if (card) {
      // Initial animation on mount
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          y: 20, 
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(card, {
          scale: 1.02,
          rotationY: 2,
          rotationX: 1,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
          transformOrigin: "center center"
        });
        gsap.to(card, {
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(card, {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        gsap.to(card, {
          rotationY: deltaX * 5,
          rotationX: -deltaY * 5,
          duration: 0.2,
          ease: "power2.out"
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mousemove', handleMouseMove);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('mousemove', handleMouseMove);
      };
    }

    if (deleteButton) {
      const handleDeleteHover = () => {
        gsap.to(deleteButton, {
          scale: 1.1,
          rotation: 5,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      };

      const handleDeleteLeave = () => {
        gsap.to(deleteButton, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      };

      deleteButton.addEventListener('mouseenter', handleDeleteHover);
      deleteButton.addEventListener('mouseleave', handleDeleteLeave);

      return () => {
        deleteButton.removeEventListener('mouseenter', handleDeleteHover);
        deleteButton.removeEventListener('mouseleave', handleDeleteLeave);
      };
    }
  }, []);

  const handleCheckboxChange = () => {
    const card = cardRef.current;
    if (card) {
      gsap.to(card, {
        scale: 0.98,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
    onToggleComplete(task.id);
  };

  return (
    <Card 
      ref={cardRef}
      className={cn(
        "mb-3 p-4 hover:shadow-md transition-shadow animate-fade-in cursor-pointer",
        priorityClass,
        task.completed && "opacity-70"
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={handleCheckboxChange}
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
              ref={deleteButtonRef}
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
