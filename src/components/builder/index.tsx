import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import FieldPallette from "./FieldPallette";
import FieldCanvas from "./FieldCanvas";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { Field } from "~/lib/interfaces/types";
import { v4 as uuidv4 } from "uuid";
import { FormContext } from "../formContext";
import { arrayMove } from "@dnd-kit/sortable";

const Builder = () => {
  const { fields, setFields } = useContext(FormContext);
  const [draggedFromPalette, setDraggedFromPalette] = useState<Field | null>(
    null
  );
  const [draggedFromCanvas, setDraggedFromCanvas] = useState<Field | null>(
    null
  );
  const [activeField, setActiveField] = useState<Field | null>(null);
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
        title:
          draggedFromPalette.title ||
          draggedFromPalette.label ||
          "Untitled Field",
        type: draggedFromPalette.type || "text",
        placeholder: draggedFromPalette?.placeholder,
        options: draggedFromPalette?.options,
        required: draggedFromPalette?.required,

        fieldLabelProperties: draggedFromPalette?.fieldLabelProperties,

        position: {
          width: 0,
          height: 0,
        },
      };

      const insertIndex = fields?.findIndex((field) => field.id === over.id);

      const updatedFields = [...fields];

      if (insertIndex === -1) {
        updatedFields.push(newField);
      } else {
        updatedFields.splice(insertIndex, 0, newField);
      }

      setFields(updatedFields);
      setActiveField(newField);
    } else if (draggedFromCanvas) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updated = arrayMove(fields, oldIndex, newIndex);
        setFields(updated);
      }
    }

    setDraggedFromPalette(null);
    setDraggedFromCanvas(null);
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-gray-200 h-screen ">
        <div>
          <Navbar />
        </div>
        <div className="grid grid-cols-[25%_45%_25%] mt-4 h-[calc(100vh-80px)] gap-4 ">
          <FieldPallette />
          <FieldCanvas />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggedFromPalette ? (
          <div
            className={`border border-gray-300 rounded-md p-2 flex justify-between items-center ${draggedFromPalette.color}  shadow-md opacity-80 relative`}
          >
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
