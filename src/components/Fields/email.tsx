import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

const EmailField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Input type="email" placeholder={field.placeholder} />
    </div>
  );
};

export default EmailField;
