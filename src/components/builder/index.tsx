import React, { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import FieldPallette from "./FieldPallette";
import FieldCanvas from "./FieldCanvas";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Field } from "~/lib/interfaces/types";
import { v4 as uuidv4 } from "uuid";
import { FormContext } from "../../context/formContext";
import { useParams } from "@tanstack/react-router";
import FieldSettings from "./FieldSettings";

const Builder = () => {
  const { form_id: formId } = useParams({ strict: false });
  const { forms, setForms, activeField, setActiveField } =
    useContext(FormContext);

  const activeForm = forms.find((f) => f.id === formId);
  const fields = activeForm?.fields || [];

  const [draggedFromPalette, setDraggedFromPalette] = useState<Field | null>(
    null
  );
  const [draggedFromCanvas, setDraggedFromCanvas] = useState<Field | null>(
    null
  );

  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [canvasRect, setCanvasRect] = useState<DOMRect | null>(null);

  // Track mouse position during drag
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-scroll when dragging near bottom edge
  useEffect(() => {
    const handleDragMove = (event: MouseEvent) => {
      const canvasElement = document.getElementById("form-canvas");
      if (
        !canvasElement ||
        !mousePosition ||
        (!draggedFromPalette && !draggedFromCanvas)
      )
        return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const scrollThreshold = 50; // Pixels from bottom edge
      const scrollSpeed = 10; // Pixels per frame

      if (mousePosition.y > canvasRect.bottom - scrollThreshold) {
        canvasElement.scrollTop += scrollSpeed;
      }
    };

    window.addEventListener("mousemove", handleDragMove);
    return () => window.removeEventListener("mousemove", handleDragMove);
  }, [mousePosition, draggedFromPalette, draggedFromCanvas]);

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

    if (!canvasRect || !mousePosition) return;

    const fieldWidth = 200;
    const fieldHeight = 100;

    let relativeX =
      (mousePosition.x - canvasRect.left - fieldWidth / 2) / canvasRect.width;
    let relativeY =
      (mousePosition.y - canvasRect.top - fieldHeight / 2) / canvasRect.height;

    relativeX = Math.max(0, Math.min(1, relativeX));
    relativeY = Math.max(0, Math.min(1, relativeY));

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
        position: {
          x: relativeX,
          y: relativeY,
          width: fieldWidth / canvasRect.width,
          height: fieldHeight / canvasRect.height,
        },
      };

      updateFormFields([...fields, newField]);
      setActiveField(newField);
    }

    if (draggedFromCanvas && over && over.id !== "form-canvas") {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updatedFields = arrayMove(fields, oldIndex, newIndex);
        updateFormFields(updatedFields);
      }
    }

    setDraggedFromPalette(null);
    setDraggedFromCanvas(null);
  };

  const handleFieldClick = (fieldId: string) => {
    const clickedField = fields.find((f) => f.id === fieldId) || null;
    setActiveField(clickedField);
  };

  const updateFields = (
    fieldId: string,
    updates: Partial<Field> & { _delete?: boolean }
  ) => {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              fields: updates._delete
                ? form.fields.filter((field) => field.id !== fieldId)
                : form.fields.map((field) =>
                    field.id === fieldId ? { ...field, ...updates } : field
                  ),
              updatedAt: new Date(),
            }
          : form
      )
    );

    setActiveField((prev) => {
      if (!prev) return prev;
      if (prev.id === fieldId) {
        if (updates._delete) return null;
        return { ...prev, ...updates };
      }
      return prev;
    });
  };

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-gray-200 h-screen overflow-hidden">
        <Navbar />
        <div className="grid grid-cols-[25%_45%_25%] mt-4 h-[calc(100vh-80px)] gap-4">
          <FieldPallette />
          <FieldCanvas
            onFieldClick={handleFieldClick}
            onUpdateField={updateFields}
            setCanvasRect={setCanvasRect}
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
