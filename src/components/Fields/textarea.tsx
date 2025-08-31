import React from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Field } from "~/lib/interfaces/types";

const TextAreaField = ({ field }: { field: Field }) => {
  return (
    <div>
      <Label>
        Textarea{" "}
        {field?.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Textarea
        placeholder={field?.placeholder}
        minLength={field?.minLength}
        maxLength={field?.maxLength}
        className="h-[calc(100%-1.5rem)]"
      />
    </div>
  );
};

export default TextAreaField;
