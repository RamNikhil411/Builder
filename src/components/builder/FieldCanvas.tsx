import { useParams } from "@tanstack/react-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Layers, Move } from "lucide-react";
import { FormContext } from "../../context/formContext";
import { useDroppable } from "@dnd-kit/core";
import FieldRender from "~/lib/helpers/FieldRender";
import { Rnd } from "react-rnd";

type GuideState = { v: number[]; h: number[] };

const ALIGN_THRESHOLD = 6; // px tolerance for showing a guide

const FieldCanvas = ({
  onFieldClick,
  onUpdateField,
  setCanvasRect,
}: {
  onFieldClick: (fieldId: string) => void;
  onUpdateField: (id: string, updates: any) => void;
  setCanvasRect: React.Dispatch<React.SetStateAction<DOMRect | null>>;
}) => {
  const { form_id } = useParams({ strict: false });
  const { forms } = useContext(FormContext);
  const form = forms.find((form) => form.id === form_id);

  const { setNodeRef } = useDroppable({
    id: "form-canvas",
    data: { type: "droppable-area" },
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [guides, setGuides] = useState<GuideState>({ v: [], h: [] });
  const [resizing, setResizing] = useState(false); // prevent MutationObserver from interfering

  // Update canvas size
  useEffect(() => {
    if (!setCanvasRect) return;

    const updateRect = () => {
      if (canvasRef.current)
        setCanvasRect(canvasRef.current.getBoundingClientRect());
    };

    updateRect();
    const observer = new ResizeObserver(updateRect);
    if (canvasRef.current) observer.observe(canvasRef.current);

    return () => observer.disconnect();
  }, [setCanvasRect]);

  // Keep field heights relative
  useEffect(() => {
    if (!form?.fields || !canvasRef.current) return;

    form.fields.forEach((field) => {
      const contentEl = contentRefs.current.get(field.id);
      if (contentEl && !field.position?.height) {
        const canvasHeight = canvasRef.current?.clientHeight;
        if (!canvasHeight) return;
        const contentHeight = contentEl.getBoundingClientRect().height;
        const heightRel = contentHeight / canvasHeight;

        if (
          !field.position?.height ||
          Math.abs(field.position.height - heightRel) > 0.01
        ) {
          onUpdateField(field.id, {
            position: { ...field.position, height: heightRel },
          });
        }
      }
    });
  }, [form?.fields, onUpdateField]);

  const getCanvasSize = () => {
    return {
      w: canvasRef.current?.clientWidth || 1,
      h: canvasRef.current?.clientHeight || 1,
    };
  };

  const rectFromField = (field: any) => {
    const { w, h } = getCanvasSize();
    const pxWidth = (field.position.width || 200 / w) * w;
    const pxHeight = (field.position.height || 80 / h) * h;
    const pxX = (field.position.x || 0) * w;
    const pxY = (field.position.y || 0) * h;
    return { id: field.id, x: pxX, y: pxY, width: pxWidth, height: pxHeight };
  };

  const computeGuides = (
    current: {
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    },
    others: Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>
  ): GuideState => {
    const vLines = new Set<number>();
    const hLines = new Set<number>();

    const curLeft = current.x;
    const curRight = current.x + current.width;
    const curCenterX = current.x + current.width / 2;

    const curTop = current.y;
    const curBottom = current.y + current.height;
    const curCenterY = current.y + current.height / 2;

    others.forEach((o) => {
      const oLeft = o.x;
      const oRight = o.x + o.width;
      const oCenterX = o.x + o.width / 2;

      if (Math.abs(curLeft - oLeft) <= ALIGN_THRESHOLD) vLines.add(oLeft);
      if (Math.abs(curRight - oRight) <= ALIGN_THRESHOLD) vLines.add(oRight);
      if (Math.abs(curCenterX - oCenterX) <= ALIGN_THRESHOLD)
        vLines.add(oCenterX);

      const oTop = o.y;
      const oBottom = o.y + o.height;
      const oCenterY = o.y + o.height / 2;

      if (Math.abs(curTop - oTop) <= ALIGN_THRESHOLD) hLines.add(oTop);
      if (Math.abs(curBottom - oBottom) <= ALIGN_THRESHOLD) hLines.add(oBottom);
      if (Math.abs(curCenterY - oCenterY) <= ALIGN_THRESHOLD)
        hLines.add(oCenterY);
    });

    return { v: Array.from(vLines), h: Array.from(hLines) };
  };

  const updateGuidesDuringDrag = (field: any, nextX: number, nextY: number) => {
    if (!form || !canvasRef.current) return setGuides({ v: [], h: [] });
    const currentRect = { ...rectFromField(field), x: nextX, y: nextY };
    const others = form.fields
      .filter((f) => f.id !== field.id)
      .map(rectFromField);
    setGuides(computeGuides(currentRect, others));
  };

  const updateGuidesDuringResize = (
    field: any,
    pxWidth: number,
    pxHeight: number,
    posX: number,
    posY: number
  ) => {
    if (!form || !canvasRef.current) return setGuides({ v: [], h: [] });
    const currentRect = {
      id: field.id,
      x: posX,
      y: posY,
      width: pxWidth,
      height: pxHeight,
    };
    const others = form.fields
      .filter((f) => f.id !== field.id)
      .map(rectFromField);
    setGuides(computeGuides(currentRect, others));
  };

  const clearGuides = () => setGuides({ v: [], h: [] });

  // Observe field content changes, but pause while resizing
  useEffect(() => {
    if (!form?.fields) return;

    const observers: MutationObserver[] = [];

    form.fields.forEach((field) => {
      const contentEl = contentRefs.current.get(field.id);
      if (!contentEl) return;

      const mutationObserver = new MutationObserver(() => {
        if (!canvasRef.current || resizing) return;

        const canvasHeight = canvasRef.current.clientHeight;
        const contentHeight = contentEl.getBoundingClientRect().height;
        const heightRel = contentHeight / canvasHeight;

        if (
          !field.position?.height ||
          Math.abs(field.position.height - heightRel) > 0.01
        ) {
          onUpdateField(field.id, {
            position: { ...field.position, height: heightRel },
          });
        }
      });

      mutationObserver.observe(contentEl, { childList: true, subtree: true });
      observers.push(mutationObserver);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [form?.fields, onUpdateField, resizing]);

  return (
    <div
      id="form-canvas"
      ref={(node) => {
        setNodeRef(node);
        canvasRef.current = node;
      }}
      className="bg-white relative rounded-md overflow-auto p-4 scrollbar-hide h-[calc(100vh-80px)]"
    >
      {form?.fields.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
        >
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
        <div className="min-h-full w-full relative">
          {form?.fields.map((field) => {
            const canvasWidth = canvasRef.current?.clientWidth || 1;
            const canvasHeight = canvasRef.current?.clientHeight || 1;

            const widthPx =
              (field.position.width || 200 / canvasWidth) * canvasWidth;
            const heightPx =
              (field.position.height || 80 / canvasHeight) * canvasHeight;
            const xPx = (field.position.x || 0) * canvasWidth;
            const yPx = (field.position.y || 0) * canvasHeight;

            return (
              <Rnd
                key={field.id}
                className="rnd-field border border-blue-500"
                size={{ width: widthPx, height: heightPx }}
                position={{ x: xPx, y: yPx }}
                bounds="parent"
                onDrag={(e, d) => updateGuidesDuringDrag(field, d.x, d.y)}
                onDragStop={(e, d) => {
                  clearGuides();
                  if (!canvasRef.current) return;
                  const xRel = d.x / canvasRef.current.clientWidth;
                  const yRel = d.y / canvasRef.current.clientHeight;
                  onUpdateField(field.id, {
                    position: { ...field.position, x: xRel, y: yRel },
                  });
                }}
                onResize={(e, dir, ref, delta, pos) => {
                  const pxW = parseInt(ref.style.width, 10);
                  const pxH = parseInt(ref.style.height, 10);
                  updateGuidesDuringResize(field, pxW, pxH, pos.x, pos.y);
                }}
                onResizeStart={() => setResizing(true)}
                onResizeStop={(e, dir, ref, del, pos) => {
                  clearGuides();
                  if (!canvasRef.current) return;
                  const widthRel =
                    parseInt(ref.style.width, 10) /
                    canvasRef.current.clientWidth;
                  const heightRel =
                    parseInt(ref.style.height, 10) /
                    canvasRef.current.clientHeight;
                  const xRel = pos.x / canvasRef.current.clientWidth;
                  const yRel = pos.y / canvasRef.current.clientHeight;

                  onUpdateField(field.id, {
                    position: {
                      width: widthRel,
                      height: heightRel,
                      x: xRel,
                      y: yRel,
                    },
                  });
                  setResizing(false);
                }}
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
                  ref={(el) => {
                    if (el) contentRefs.current.set(field.id, el);
                    else contentRefs.current.delete(field.id);
                  }}
                  onClick={() => onFieldClick(field.id)}
                >
                  {FieldRender(field)}
                </div>
              </Rnd>
            );
          })}

          {/* Alignment Guides */}
          {guides.v.map((x, i) => (
            <div
              key={`v-${i}`}
              className="pointer-events-none absolute top-0 bottom-0 w-[1px] bg-red-500"
              style={{ left: x }}
            />
          ))}
          {guides.h.map((y, i) => (
            <div
              key={`h-${i}`}
              className="pointer-events-none absolute left-0 right-0 h-[1px] bg-red-500"
              style={{ top: y }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldCanvas;
