
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const CalendarView = () => {
  const { tasks } = useTaskContext();
  const [date, setDate] = React.useState<Date>(new Date());
  
  // Group tasks by date
  const tasksByDate: Record<string, typeof tasks> = {};
  tasks.forEach(task => {
    const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  // Function to highlight dates with tasks
  const isDayWithTasks = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return !!tasksByDate[dateKey];
  };
  
  const selectedDateKey = date ? format(date, 'yyyy-MM-dd') : '';
  const tasksForSelectedDate = selectedDateKey ? tasksByDate[selectedDateKey] || [] : [];

  return (
    <div className="p-6 flex-1 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Calendar View</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border w-full"
                modifiers={{
                  hasTasks: (day) => isDayWithTasks(day),
                }}
                modifiersClassNames={{
                  hasTasks: "bg-primary/20",
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>
                Tasks for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {tasksForSelectedDate.map(task => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-md ${
                        task.priority === 'high' ? 'bg-red-100' : 
                        task.priority === 'medium' ? 'bg-yellow-100' : 
                        'bg-green-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded bg-white/80">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">{task.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No tasks scheduled for this date
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
