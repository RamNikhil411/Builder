import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Field } from "~/lib/interfaces/types";

const RadioButton = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <RadioGroup className="flex flex-wrap mt-2 h-[calc(100%-1.5rem)]">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioButton;
