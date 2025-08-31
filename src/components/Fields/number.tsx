import React from "react";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";
import { Label } from "../ui/label";

const NumberField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Input
        placeholder={field.placeholder}
        onChange={(e) => {
          const newValue = e.target.value;
          const numericValue = newValue.replace(/[^0-9]/g, "");
          e.target.value = numericValue;
        }}
      />
    </div>
  );
};

export default NumberField;
