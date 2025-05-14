
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface ReminderSettingProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

const ReminderSetting = ({ value, onChange, disabled = false }: ReminderSettingProps) => {
  const [time, setTime] = React.useState<string>("09:00");
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const reminderDate = new Date(date);
    reminderDate.setHours(hours, minutes);
    
    onChange(reminderDate);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    
    if (value) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes);
      onChange(newDate);
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Reminder</label>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Set date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={value || undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select 
          value={time} 
          onValueChange={handleTimeChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }).map((_, hour) => (
              <React.Fragment key={hour}>
                <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </SelectItem>
                <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                  {`${hour.toString().padStart(2, '0')}:30`}
                </SelectItem>
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ReminderSetting;
