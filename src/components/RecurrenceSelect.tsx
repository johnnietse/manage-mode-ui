
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Repeat } from 'lucide-react';

export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

interface RecurrenceSelectProps {
  value: RecurrencePattern;
  onChange: (value: RecurrencePattern) => void;
  disabled?: boolean;
}

const RecurrenceSelect = ({ value, onChange, disabled = false }: RecurrenceSelectProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Recurrence</label>
      <Select value={value} onValueChange={onChange as (value: string) => void} disabled={disabled}>
        <SelectTrigger className="flex items-center">
          <Repeat className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Select recurrence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RecurrenceSelect;
