import React, { useContext, useState } from "react";

import Navbar from "./Navbar";
import FieldPallette from "./FieldPallette";
import FieldCanvas from "./FieldCanvas";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { Field } from "~/lib/interfaces/types";
import { v4 as uuidv4 } from "uuid";
import { FormContext } from "../../context/formContext";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams } from "@tanstack/react-router";
import FieldSettings from "./FieldSettings";

const Builder = () => {
  const { form_id: formId } = useParams({ strict: false });
  const { forms, setForms } = useContext(FormContext);

  const activeForm = forms.find((f) => f.id === formId);
  const fields = activeForm?.fields || [];

  const [draggedFromPalette, setDraggedFromPalette] = useState<Field | null>(
    null
  );
  const [draggedFromCanvas, setDraggedFromCanvas] = useState<Field | null>(
    null
  );
  const [activeField, setActiveField] = useState<Field | null>(null);

  const updateFormFields = (updatedFields: Field[]) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId ? { ...form, fields: updatedFields } : form
      )
    );
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const fieldData = active.data.current?.field;
    const isFromPalette = active.data.current?.isFromPalette;

    if (isFromPalette && fieldData) {
      setDraggedFromPalette(fieldData);
    } else if (fieldData) {
      setDraggedFromCanvas(fieldData);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) {
      setDraggedFromPalette(null);
      setDraggedFromCanvas(null);
      return;
    }

    if (draggedFromPalette) {
      const newField: Field = {
        id: uuidv4(),
        label: draggedFromPalette.label || "Untitled Field",
        name: draggedFromPalette.name,
        title:
          draggedFromPalette.title ||
          draggedFromPalette.label ||
          "Untitled Field",
        type: draggedFromPalette.type || "text",
        placeholder: draggedFromPalette?.placeholder,
        options: draggedFromPalette?.options,
        required: draggedFromPalette?.required,
        fieldLabelProperties: draggedFromPalette?.fieldLabelProperties,
        position: { width: 0, height: 0, x: 0, y: 0 },
      };

      const insertIndex = fields.findIndex((field) => field.id === over.id);
      const updatedFields = [...fields];
      if (insertIndex === -1) {
        updatedFields.push(newField);
      } else {
        updatedFields.splice(insertIndex, 0, newField);
      }

      updateFormFields(updatedFields);
      setActiveField(newField);
    } else if (draggedFromCanvas) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updated = arrayMove(fields, oldIndex, newIndex);
        updateFormFields(updated);
      }
    }

    setDraggedFromPalette(null);
    setDraggedFromCanvas(null);
  };

  const handleFieldClick = (fieldId: string) => {
    const clickedField = fields.find((f) => f.id === fieldId) || null;
    setActiveField(clickedField);
  };

  const updateFields = (fieldId: string, updates: Partial<Field>) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: form.fields.map((field) =>
                field.id === fieldId ? { ...field, ...updates } : field
              ),
            }
          : form
      )
    );

    setActiveField((prev) =>
      prev && prev.id === fieldId ? { ...prev, ...updates } : prev
    );
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-gray-200 h-screen">
        <Navbar />
        <div className="grid grid-cols-[25%_45%_25%] mt-4 h-[calc(100vh-80px)] gap-4">
          <FieldPallette />
          <FieldCanvas
            onFieldClick={handleFieldClick}
            onUpdateField={updateFields}
          />
          <FieldSettings
            activeField={activeField}
            setActiveField={setActiveField}
            updateFields={updateFields}
          />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggedFromPalette ? (
          <div className="border border-gray-300 rounded-md p-2 flex justify-between items-center shadow-md opacity-80 relative bg-white">
            <div className="font-normal text-[15px] text-slate-800">
              {draggedFromPalette.label}
            </div>
            <div>
              {draggedFromPalette.icon && (
                <draggedFromPalette.icon className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Builder;
