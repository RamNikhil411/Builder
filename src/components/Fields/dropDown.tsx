import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DropDownField = () => {
  return (
    <div>
      <Label>DropDown</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a value" />
          <SelectContent>
            <SelectItem value="value1">Value 1</SelectItem>
            <SelectItem value="value2">Value 2</SelectItem>
            <SelectItem value="value3">Value 3</SelectItem>
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  );
};

export default DropDownField;
