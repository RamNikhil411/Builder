import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";

const FileUploadField = ({ field }: { field: Field }) => {
  return (
    <div className="space-y-1">
      <Label>{field.label}</Label>
      <Input
        type="file"
        placeholder={field.placeholder}
        className="h-[calc(100%-1.5rem)]"
      />
    </div>
  );
};

export default FileUploadField;
