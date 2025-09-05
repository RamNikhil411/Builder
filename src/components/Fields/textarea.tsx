import React from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

interface TextAreaFieldProps {
  field: Field;
  value?: string;
  onChange?: (val: string) => void;
}

const TextAreaField = ({ field, value, onChange }: TextAreaFieldProps) => {
  return (
    <div className="space-y-1 h-full">
      <Label>
        {field.label}{" "}
        {field?.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Textarea
        placeholder={field?.placeholder}
        minLength={field?.minLength}
        maxLength={field?.maxLength}
        className="h-[calc(100%-1.5rem)]"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default TextAreaField;
