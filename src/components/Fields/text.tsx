import React from "react";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";
import { Label } from "../ui/label";

const TextField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}{" "}
      </Label>
      <Input
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        minLength={field.minLength}
      />
    </div>
  );
};

export default TextField;
