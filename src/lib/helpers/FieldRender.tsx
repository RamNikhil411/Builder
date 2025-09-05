import React from "react";
import { Field } from "../interfaces/types";
import TextField from "~/components/Fields/text";
import EmailField from "~/components/Fields/email";
import FileUploadField from "~/components/Fields/FileUpload";
import NumberField from "~/components/Fields/number";

import RadioButton from "~/components/Fields/radiobutton";
import CheckBoxField from "~/components/Fields/checkbox";
import { DatePickerField } from "~/components/Fields/datePicker";
import DropDownField from "~/components/Fields/dropDown";
import TextAreaField from "~/components/Fields/textarea";
import Heading from "~/components/Fields/heading";

interface FieldRenderProps {
  field: Field;
  value?: string | string[];
  onChange?: (value: string) => void;
}

const FieldRender = ({ field, value, onChange }: FieldRenderProps) => {
  switch (field.type) {
    case "text":
      return (
        <TextField field={field} value={value as string} onChange={onChange} />
      );
    case "email":
      return (
        <EmailField field={field} value={value as string} onChange={onChange} />
      );
    case "number":
      return (
        <NumberField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <CheckBoxField
          field={field}
          value={value as string[]}
          onChange={onChange}
        />
      );
    case "radio_buttons":
      return (
        <RadioButton
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "date_picker":
      return (
        <DatePickerField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "file_upload":
      return (
        <FileUploadField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "dropdown":
      return (
        <DropDownField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "textarea":
      return (
        <TextAreaField
          field={field}
          value={value as string}
          onChange={onChange}
        />
      );
    case "heading":
      return <Heading field={field} />;
  }
};

export default FieldRender;
