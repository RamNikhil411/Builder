import React from "react";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";
import { Label } from "../ui/label";

interface NumberFieldProps {
  field: Field;
  value?: string;
  onChange?: (value: string) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  field,
  value = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // strip out non-digits
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange?.(numericValue);
  };

  return (
    <div className="space-y-1">
      <Label>
        {field.label}
        {field.required && <span className="text-red-600">*</span>}
      </Label>
      <Input
        type="text"
        inputMode="numeric"
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
        className="h-[calc(100%-1.5rem)]"
      />
    </div>
  );
};

export default NumberField;
