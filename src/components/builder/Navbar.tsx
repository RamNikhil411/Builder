import { ArrowLeft, Eye, KeyboardIcon, Save } from "lucide-react";
import React, { useContext } from "react";
import { Separator } from "../ui/separator";
import { FormContext } from "../../context/formContext";
import { useParams } from "@tanstack/react-router";
import { Button } from "../ui/button";
import SaveIndicator from "../core/SavingIndicator";

const Navbar = () => {
  const { forms, setForms, isSaving, lastSavedAt } = useContext(FormContext);
  const { form_id } = useParams({ strict: false });
  const form = forms.find((form) => form.id === form_id);
  return (
    <div className="px-6 py-4 h-16 flex justify-between bg-white shadow">
      <div className="flex gap-6 items-center h-full">
        <div className="flex items-center">
          <ArrowLeft />
          <span className="font-medium">Back To Dashboard</span>
        </div>
        <div className="h-full flex gap-4 items-center">
          <Separator orientation="vertical" className=" " />
          <div>
            <h1 className="font-medium text-xl">{form?.title}</h1>
            <div className="flex gap-1 items-center ">
              <p>Form Builder </p>{" "}
              <span className="bg-gray-100 text-xs px-2 py-1 rounded text-gray-500">
                {form?.fields.length} fields
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <div>
          <KeyboardIcon className="w-4 h-4" />
        </div>
        <div>
          <SaveIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
        </div>
        <div>
          <Button className="bg-green-600 hover:bg-green-600 border ">
            <Eye />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
