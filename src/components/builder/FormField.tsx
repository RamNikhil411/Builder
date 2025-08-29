import React from "react";
import { useDraggable } from "@dnd-kit/core";

const FormField = ({ field, index }: { field: any; index: number }) => {
  const { listeners, setNodeRef, attributes } = useDraggable({
    id: `palette-${field.label}`,
    data: {
      type: "form-field",
      field,
      isFromPalette: true,
    },
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="w-full">
      <div
        className={`border border-gray-200 p-2 ${field.color} cursor-pointer transition-all duration-200 hover:shadow-md  rounded-md flex justify-between items-center gap-2`}
      >
        <p className="text-sm">{field.label}</p>
        <field.icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default FormField;
