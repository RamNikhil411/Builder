import { useParams } from "@tanstack/react-router";
import React, { useContext } from "react";
import { motion } from "motion/react";
import { Layers, Move } from "lucide-react";
import { FormContext } from "../../context/formContext";
import { useDroppable } from "@dnd-kit/core";
import FieldRender from "~/lib/helpers/FieldRender";

const FieldCanvas = ({
  onFieldClick,
}: {
  onFieldClick: (fieldId: string) => void;
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
      <div className="space-y-3">
        {form?.fields.length === 0 ? (
          <div>
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
          </div>
        ) : (
          form?.fields.map((field) => (
            <div key={field.id} onClick={() => onFieldClick(field.id)}>
              {" "}
              {FieldRender(field)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FieldCanvas;
