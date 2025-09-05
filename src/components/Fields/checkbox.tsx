import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Field } from "~/lib/interfaces/types";

interface CheckBoxFieldProps {
  field: Field;
  value?: string[];
  onChange?: (val: string) => void;
}

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  field,
  value = [],
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </Label>
      <div className="flex flex-wrap gap-2 h-[calc(100%-1.5rem)]">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${option}`}
              checked={value.includes(option)}
              onCheckedChange={() => onChange?.(option)}
            />
            <Label htmlFor={`${field.id}-${option}`} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckBoxField;
