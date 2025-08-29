import { Palette } from "lucide-react";
import React, { useContext } from "react";
import { motion } from "motion/react";
import { formfields } from "~/lib/constants/formFieldConstants";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormContext } from "../formContext";
import { useParams } from "@tanstack/react-router";
import { Textarea } from "../ui/textarea";
import FormField from "./FormField";

const FieldPallette = () => {
  const { forms, setForms } = useContext(FormContext);
  const { form_id } = useParams({ strict: false });
  const formIndex = forms.findIndex((f) => f.id === form_id);
  const form = forms[formIndex];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForms = [...forms];
    updatedForms[formIndex] = { ...form, title: e.target.value };
    setForms(updatedForms);
  };

  return (
    <div className="bg-white p-3 mx-2 rounded-md">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Palette className="w-5 h-5 text-blue-600" />
        </motion.div>
        <span className="text-xl font-medium">Field Palette</span>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="form_title">Form Title</Label>
          <Input
            className="mt-2"
            id="form_title"
            value={form.title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <Label htmlFor="form_description">Form Description</Label>
          <Textarea
            className="mt-2"
            id="form_description"
            value={form.description}
            onChange={(e) => {
              const updatedForms = [...forms];
              updatedForms[formIndex] = {
                ...form,
                description: e.target.value,
              };
              setForms(updatedForms);
            }}
          />
        </div>
      </div>
      <div className="mt-5 text-gray-600 font-normal">
        <p>Drag the fields to Canvas</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {formfields.map((field, index) => (
          <FormField field={field} index={index} key={index} />
        ))}
      </div>
    </div>
  );
};

export default FieldPallette;
