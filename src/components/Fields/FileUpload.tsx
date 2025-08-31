import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const FileUploadField = () => {
  return (
    <div>
      <Label>File Upload</Label>
      <Input type="file" />
    </div>
  );
};

export default FileUploadField;
