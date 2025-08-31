import { useParams } from "@tanstack/react-router";
import React, { useContext } from "react";
import { motion } from "motion/react";
import { Layers, Move } from "lucide-react";
import { FormContext } from "../../context/formContext";
import { useDroppable } from "@dnd-kit/core";
import FieldRender from "~/lib/helpers/FieldRender";
import { Rnd } from "react-rnd";

const FieldCanvas = ({
  onFieldClick,
  onUpdateField,
}: {
  onFieldClick: (fieldId: string) => void;
  onUpdateField: (id: string, updates: any) => void;
}) => {
  const { form_id } = useParams({ strict: false });
  const { forms } = useContext(FormContext);
  const form = forms.find((form) => form.id === form_id);
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
    data: { type: "droppable-area" },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white h-full relative rounded-md overflow-auto p-4 scrollbar-hide"
    >
      {form?.fields.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <div className="text-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Canvas is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Add fields from the palette to start building
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Move className="w-4 h-4" />
              <span>Drag • Resize • Position with React RND</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="relative w-full h-full">
          {form?.fields.map((field) => (
            <Rnd
              key={field.id}
              size={{
                width: field.position.width || 200,
                height: field.position.height || 80,
              }}
              position={{ x: field.position.x || 0, y: field.position.y || 0 }}
              onDragStop={(e, d) =>
                onUpdateField(field.id, {
                  position: { ...field.position, x: d.x, y: d.y },
                })
              }
              onResizeStop={(e, dir, ref, delta, pos) =>
                onUpdateField(field.id, {
                  position: {
                    ...field.position,
                    width: parseInt(ref.style.width, 10),
                    height: parseInt(ref.style.height, 10),
                    x: pos.x,
                    y: pos.y,
                  },
                })
              }
              bounds="parent"
              className="group"
              resizeHandleComponent={{
                bottomRight: (
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                ),
                bottomLeft: (
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                ),
                topRight: (
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                ),
                topLeft: (
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity" />
                ),
              }}
              resizeHandleStyles={{
                bottomRight: { right: "-12px", bottom: "-12px" },
                bottomLeft: { left: "-6px", bottom: "-12px" },
                topRight: { right: "-12px", top: "-6px" },
                topLeft: { left: "-6px", top: "-6px" },
              }}
            >
              <div
                className="group border rounded shadow-sm h-full bg-white p-2 cursor-pointer"
                onClick={() => onFieldClick(field.id)}
              >
                {FieldRender(field)}
              </div>
            </Rnd>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldCanvas;
