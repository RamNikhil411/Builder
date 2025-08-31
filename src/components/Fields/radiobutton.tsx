import React from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const RadioButton = () => {
  return (
    <div>
      <Label>Radio Button</Label>
      <RadioGroup>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="item1" />
          <Label>Item 1</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="item2" />
          <Label>Item 2</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="item3" />
          <Label>Item 3</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioButton;
