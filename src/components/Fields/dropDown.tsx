import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field } from "~/lib/interfaces/types";

interface DropDownFieldProps {
  field: Field;
  value?: string;
  onChange?: (val: string) => void;
}

const DropDownField = ({ field, value, onChange }: DropDownFieldProps) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-[calc(100%-1.5rem)]">
          <SelectValue placeholder={field?.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field?.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropDownField;
