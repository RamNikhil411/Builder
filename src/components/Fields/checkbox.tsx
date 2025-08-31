import React from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const CheckBoxField = () => {
  return (
    <div>
      <Label>Checkbox</Label>
      <div className="flex items-center space-x-2">
        <Checkbox /> <Label>item</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox /> <Label>item</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox /> <Label>item</Label>
      </div>
    </div>
  );
};

export default CheckBoxField;
