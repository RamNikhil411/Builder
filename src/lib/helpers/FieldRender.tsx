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

const FieldRender = (field: Field) => {
  switch (field.name) {
    case "text":
      return <TextField field={field} />;
    case "email":
      return <EmailField field={field} />;
    case "number":
      return <NumberField />;
    case "checkbox":
      return <CheckBoxField />;
    case "radio_buttons":
      return <RadioButton />;
    case "date_picker":
      return <DatePickerField />;
    case "file_upload":
      return <FileUploadField />;
    case "dropdown":
      return <DropDownField />;
    case "textarea":
      return <TextAreaField />;
  }
};

export default FieldRender;
