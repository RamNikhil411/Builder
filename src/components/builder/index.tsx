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
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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

    // Handle sorting within FieldCanvas
    if (draggedFromCanvas && over && over.id !== "form-canvas") {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const updatedFields = arrayMove(fields, oldIndex, newIndex);
        // Update positions to reflect new order
        const sortedFields = updatedFields.map((field, index) => ({
          ...field,
          position: {
            ...field.position,
            y: index * 100, // Stack fields vertically (adjust as needed)
          },
        }));
        updateFormFields(sortedFields);
        console.log("Fields reordered:", { oldIndex, newIndex });
      }
      setDraggedFromCanvas(null);
      return;
    }

    // Handle drop from palette
    if (
      !over ||
      !mousePosition ||
      over.id !== "form-canvas" ||
      !draggedFromPalette
    ) {
      console.log("Drop ignored:", {
        over: over ? over.id : null,
        mousePosition,
      });
      setDraggedFromPalette(null);
      setDraggedFromCanvas(null);
      return;
    }

    const canvasElement = document.getElementById("form-canvas");
    if (!canvasElement) {
      console.error("Canvas element not found");
      return;
    }

    const canvasRect = canvasElement.getBoundingClientRect();
    // Fixed padding for p-4 (16px)
    const canvasPadding = 16;
    // Default field size
    const fieldWidth = 200;
    const fieldHeight = 80;
    // Center the field: subtract half the field size
    const dropX =
      mousePosition.x -
      canvasRect.left +
      canvasElement.scrollLeft -
      canvasPadding -
      fieldWidth / 2;
    const dropY =
      mousePosition.y -
      canvasRect.top +
      canvasElement.scrollTop -
      canvasPadding -
      fieldHeight / 2;

    console.log("Drop coordinates:", {
      dropX,
      dropY,
      cursorX: dropX + fieldWidth / 2,
      cursorY: dropY + fieldHeight / 2,
      canvasRect: {
        left: canvasRect.left,
        top: canvasRect.top,
        width: canvasRect.width,
        height: canvasRect.height,
      },
      mousePosition,
      scrollLeft: canvasElement.scrollLeft,
      scrollTop: canvasElement.scrollTop,
      canvasPadding,
      fieldWidth,
      fieldHeight,
    });

    // Validate drop: ensure cursor (field center) is within canvas width
    const effectiveWidth = canvasRect.width - canvasPadding * 2;
    const cursorX = dropX + fieldWidth / 2;
    const cursorY = dropY + fieldHeight / 2;

    if (cursorX >= 0 && cursorX <= effectiveWidth && cursorY >= 0) {
      // Clamp x-axis to keep field within canvas width
      const clampedX = Math.max(
        0,
        Math.min(dropX, effectiveWidth - fieldWidth)
      );
      // Allow y-axis to be unrestricted (canvas can scroll)
      const clampedY = Math.max(0, dropY);

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
          x: clampedX,
          y: clampedY,
          width: fieldWidth,
          height: fieldHeight,
        },
      };

      updateFormFields([...fields, newField]);
      setActiveField(newField);
      console.log("Field placed:", {
        id: newField.id,
        x: newField.position.x,
        y: newField.position.y,
        clamped: clampedX !== dropX || clampedY !== dropY,
      });

      // Scroll to the newly placed field
      const fieldTop = clampedY;
      const fieldBottom = clampedY + fieldHeight;
      const canvasHeight = canvasRect.height - canvasPadding * 2;
      if (fieldBottom > canvasElement.scrollTop + canvasHeight) {
        canvasElement.scrollTo({
          top: fieldBottom - canvasHeight + canvasPadding,
          behavior: "smooth",
        });
      } else if (fieldTop < canvasElement.scrollTop) {
        canvasElement.scrollTo({
          top: fieldTop - canvasPadding,
          behavior: "smooth",
        });
      }
    } else {
      console.warn("Drop outside canvas bounds:", {
        cursorX,
        cursorY,
        dropX,
        dropY,
        effectiveWidth,
        fieldWidth,
        fieldHeight,
      });
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
      <div className="bg-gray-200 h-screen overflow-hidden">
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
