import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Field } from "~/lib/interfaces/types";

const CheckBoxField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox id={option} value={option} />
            <Label htmlFor={option} className="font-normal">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckBoxField;
