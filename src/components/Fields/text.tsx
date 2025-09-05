import React from "react";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";
import { Label } from "../ui/label";

interface TextFieldProps {
  field: Field;
  value?: string;
  onChange?: (val: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value = "",
  onChange,
}) => {
  return (
    <div className="space-y-1 h-full">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Input
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        minLength={field.minLength}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[calc(100%-1.5rem)]"
      />
    </div>
  );
};

export default TextField;
