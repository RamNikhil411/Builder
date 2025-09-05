import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

interface EmailFieldProps {
  field: Field;
  value?: string;
  onChange?: (value: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({
  field,
  value = "",
  onChange,
}) => {
  return (
    <div className="space-y-1 h-full">
      <Label>
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </Label>
      <Input
        type="email"
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[calc(100%-1.5rem)]"
      />
    </div>
  );
};

export default EmailField;
