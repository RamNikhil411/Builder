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
  switch (field.type) {
    case "text":
      return <TextField field={field} />;
    case "email":
      return <EmailField field={field} />;
    case "number":
      return <NumberField field={field} />;
    case "checkbox":
      return <CheckBoxField field={field} />;
    case "radio_buttons":
      return <RadioButton field={field} />;
    case "date_picker":
      return <DatePickerField field={field} />;
    case "file_upload":
      return <FileUploadField field={field} />;
    case "dropdown":
      return <DropDownField field={field} />;
    case "textarea":
      return <TextAreaField field={field} />;
  }
};

export default FieldRender;
