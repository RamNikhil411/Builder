"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

interface DatePickerFieldProps {
  field: Field;
  value?: string; // ISO date string or formatted string
  onChange?: (val: string) => void;
}

export function DatePickerField({
  field,
  value,
  onChange,
}: DatePickerFieldProps) {
  const parsedDate = value ? new Date(value) : undefined;

  return (
    <Popover>
      <div className="space-y-1">
        <Label>
          {field.label}{" "}
          {field.required ? <span className="text-red-600">*</span> : null}
        </Label>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!parsedDate}
            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parsedDate ? (
              format(parsedDate, "PPP")
            ) : (
              <span>{field.placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={parsedDate}
          onSelect={(d) => d && onChange?.(d.toISOString())}
        />
      </PopoverContent>
    </Popover>
  );
}
