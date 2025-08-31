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

const DropDownField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={field?.placeholder || "Select an option"} />
          <SelectContent>
            {field?.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  );
};

export default DropDownField;
