import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";

interface FileUploadFieldProps {
  field: Field;
  value?: string; // stored in localStorage
  onChange?: (val: string) => void;
}

const FileUploadField = ({ field, value, onChange }: FileUploadFieldProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 string for localStorage
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onChange?.(base64); // save in answers → localStorage
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1">
      <Label>
        {field.label}{" "}
        {field.required ? <span className="text-red-600">*</span> : null}
      </Label>
      <Input
        type="file"
        onChange={handleFileChange}
        className="h-[calc(100%-1.5rem)]"
      />
      {value && (
        <p className="text-sm text-muted-foreground">
          {value.startsWith("data:")
            ? "File uploaded (stored in localStorage)"
            : `Selected: ${value}`}
        </p>
      )}
    </div>
  );
};

export default FileUploadField;
