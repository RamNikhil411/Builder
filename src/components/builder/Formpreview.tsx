import { useNavigate, useParams } from "@tanstack/react-router";
import React, { useContext, useRef, useEffect, useState } from "react";
import { FormContext } from "~/context/formContext";
import FieldRender from "~/lib/helpers/FieldRender";
import { Button } from "../ui/button";
import { ArrowLeft, Send } from "lucide-react";

export interface Answer {
  id: string;
  label: string;
  type: string;
  value: string | string[];
}

const Formpreview = () => {
  const { forms, setForms } = useContext(FormContext);
  const { form_id } = useParams({ strict: false });
  const form = forms.find((form) => form.id === form_id);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 1, h: 1 });
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      setCanvasSize({
        w: containerRef.current?.clientWidth || 1,
        h: containerRef.current?.clientHeight || 1,
      });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAnswerChange = (
    fieldId: string,
    label: string,
    value: string,
    type: string
  ) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.id === fieldId);

      if (type === "checkbox") {
        if (existing) {
          const values = Array.isArray(existing.value) ? existing.value : [];

          const newValues = values.includes(value)
            ? values.filter((v) => v !== value)
            : [...values, value];

          return prev.map((a) =>
            a.id === fieldId ? { ...a, value: newValues } : a
          );
        }
        return [...prev, { id: fieldId, label, value: [value], type }];
      }

      if (existing) {
        return prev.map((a) => (a.id === fieldId ? { ...a, value } : a));
      }
      return [...prev, { id: fieldId, label, value, type }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const newSubmission = {
      answers: [...answers],
      submittedAt: new Date(),
    };

    const updatedForm = {
      ...form,
      answers: [...(form.answers || []), newSubmission],
    };

    setForms((prev) => prev.map((f) => (f.id === form.id ? updatedForm : f)));

    setAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 h-screen">
      <div className="flex items-center gap-4 mb-2 bg-white p-4">
        <Button
          className="text-base font-medium"
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      <div
        ref={containerRef}
        className="h-[calc(100vh-80px)] max-w-2xl mx-auto bg-white shadow rounded flex flex-col"
      >
        <form
          id="form-preview"
          className="flex-1 relative overflow-auto scrollbar-hide"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl mt-2 font-medium text-center">
            {form?.title}
          </h1>
          <p className="mt-2 text-sm  text-center">{form?.description}</p>

          <div className="relative w-full mt-2 h-full">
            {form?.fields.map((field) => {
              const { position } = field;

              const left = (position?.x || 0) * canvasSize.w;
              const top = (position?.y || 0) * canvasSize.h;

              const width = `${(position?.width || 0.3) * 100}%`;
              const height = `${(position?.height || 0.1) * 100}%`;
              const currentValue =
                answers.find((a) => a.id === field.id)?.value ||
                (field.type === "checkbox" ? [] : "");

              return (
                <div
                  key={field.id}
                  className="absolute bg-white p-2"
                  style={{
                    left,
                    top,
                    width,
                    height,
                  }}
                >
                  <FieldRender
                    field={field}
                    value={currentValue}
                    onChange={(val) =>
                      handleAnswerChange(field.id, field.label, val, field.type)
                    }
                  />
                </div>
              );
            })}
          </div>
        </form>

        <div className="py-2 bg-white">
          <div className="flex justify-center">
            <Button
              type="submit"
              form="form-preview"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formpreview;
