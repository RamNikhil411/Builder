import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field } from "~/lib/interfaces/types";

interface RadioButtonProps {
  field: Field;
  value?: string;
  onChange?: (val: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  field,
  value = "",
  onChange,
}) => {
  return (
    <div className="flex flex-col h-full">
      <Label className="mb-1">
        {field.label}{" "}
        {field.required && <span className="text-red-600">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange?.(val)}
        className="flex flex-wrap gap-4 mt-2"
      >
        {field.options?.map((option, idx) => {
          const optionId = `${field.id}-${idx}`;
          return (
            <div key={optionId} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={optionId} />
              <Label htmlFor={optionId} className="font-normal">
                {option}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default RadioButton;
