"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useState } from "react";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

export function DatePickerField({ field }: { field: Field }) {
  const [date, setDate] = useState<Date>();

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
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>{field.placeholder}</span>}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
