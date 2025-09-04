import React, { useContext } from "react";
import { FormContext } from "~/context/formContext";
import { Field } from "~/lib/interfaces/types";
import { motion } from "motion/react";
import {
  Eye,
  Lock,
  Palette,
  Pencil,
  Plus,
  Settings,
  Trash,
  Type,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { strict } from "assert";
import { useParams } from "@tanstack/react-router";
import AlignStartIcon from "../ui/icons/AlignStartIcon";
import AlignCenterIcon from "../ui/icons/AlignCenterIcon";
import AlignEndIcon from "../ui/icons/AlignEnd";
import AlignJustifyIcon from "../ui/icons/AlignJustifyIcon";

const FieldSettings = ({
  activeField,
  setActiveField,
  updateFields,
}: {
  activeField: Field | null;
  setActiveField: React.Dispatch<React.SetStateAction<Field | null>>;
  updateFields: (
    fieldId: string,
    updates: Partial<Field> & { _delete?: boolean }
  ) => void;
}) => {
  const { forms, setForms } = useContext(FormContext);
  const { form_id } = useParams({ strict: false });
  const form = forms.find((form) => form.id === form_id);

  const handleAddOption = (fieldId: string) => {
    const newOptions = [
      ...(activeField?.options || []),
      `Option ${(activeField?.options?.length || 0) + 1}`,
    ];
    updateFields(fieldId, { options: newOptions });
  };

  const optionsTabFields = ["dropdown", "radio_buttons", "checkbox"];
  const validatedFields = ["email", "number"];

  const sizes: {
    value: string;
    heading_size: number;
    subheading_size: number;
  }[] = [
    {
      value: "small",
      heading_size: 18,
      subheading_size: 16,
    },
    {
      value: "medium",
      heading_size: 20,
      subheading_size: 18,
    },
    {
      value: "large",
      heading_size: 24,
      subheading_size: 20,
    },
  ];

  const Alignments = [
    { value: "start", icon: AlignStartIcon },
    { value: "center", icon: AlignCenterIcon },
    { value: "end", icon: AlignEndIcon },
    { value: "justify", icon: AlignJustifyIcon },
  ];

  return (
    <div className="bg-white p-4">
      {!activeField ? (
        <div className="space-y-2 p-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Settings className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-center text-xl font-medium">No field selected</h1>
          <p className="text-center text-gray-600">
            Select a Field from the canvas to edit its Properties
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-center text-gray-400 flex gap-2 items-center justify-center">
              <Eye className="w-4 h-4" />
              click any field to Select
            </p>
            <p className="text-center text-gray-400 flex gap-2 items-center justify-center">
              <Type className="w-4 h-4" />
              Customization Labels,Validation & more
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 items-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Settings className="w-5 h-5 text-gray-300 mx-auto " />
            </motion.div>
            <h2 className="text-lg font-normal">
              {activeField?.name} Settings
            </h2>
          </div>
          <Tabs defaultValue="basic">
            <TabsList className="w-full mt-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger
                value="options"
                disabled={!optionsTabFields.includes(activeField?.type)}
              >
                Options
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                disabled={[
                  ...optionsTabFields,
                  "date_picker",
                  "heading",
                ].includes(activeField?.type)}
              >
                Rules
              </TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {" "}
                  <Type className="w-4 h-4" />{" "}
                  {activeField?.type === "heading"
                    ? "Enter Heading"
                    : "Field Label"}
                </Label>
                <Input
                  value={activeField?.label}
                  onChange={(e) => {
                    updateFields(activeField?.id || "", {
                      label: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {" "}
                  {activeField?.type === "heading"
                    ? "Enter Sub heading"
                    : "Field Placeholder"}
                </Label>
                <Input
                  value={
                    activeField?.type === "heading"
                      ? activeField?.value
                      : activeField?.placeholder
                  }
                  onChange={(e) => {
                    if (activeField?.type === "heading") {
                      updateFields(activeField?.id || "", {
                        value: e.target.value,
                      });
                    } else {
                      updateFields(activeField?.id || "", {
                        placeholder: e.target.value,
                      });
                    }
                  }}
                />
              </div>
              {activeField?.type === "heading" ? (
                <div>
                  <h1>Size</h1>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {sizes.map((size, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Input
                          type="radio"
                          className="h-4 w-4"
                          name="size"
                          value={size.value}
                          checked={
                            size.heading_size ===
                            activeField?.size?.heading_size
                          }
                          onChange={() => {
                            updateFields(activeField?.id || "", {
                              size: {
                                heading_size: size.heading_size,
                                subheading_size: size.subheading_size,
                              },
                            });
                          }}
                        />
                        <span className="capitalize">{size.value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-x-2 rounded-md bg-gray-100 p-4">
                  <Lock className="w-5 h-5" />
                  <Label>Required Field</Label>
                  <Switch
                    className="data-[state=checked]:bg-blue-600"
                    checked={activeField?.required}
                    onCheckedChange={(checked) =>
                      updateFields(activeField?.id || "", { required: checked })
                    }
                  />
                </div>
              )}

              {activeField?.type === "heading" && (
                <div className="mt-6">
                  <h1 className="mb-2 font-medium">Text Alignment</h1>
                  <div className="grid grid-cols-4 gap-2">
                    {Alignments.map((align, index) => {
                      const Icon = align.icon;
                      return (
                        <button
                          key={index}
                          onClick={() =>
                            updateFields(activeField?.id || "", {
                              alignment: align.value,
                            })
                          }
                          className={`flex items-center justify-center p-2 rounded-md border 
              ${
                activeField?.alignment === align.value
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex  ">
                <Button
                  onClick={() =>
                    updateFields(activeField?.id || "", { _delete: true })
                  }
                  className=""
                >
                  <Trash className="w-4 h-4" />
                  Delete Field
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="options" className="space-y-4">
              <div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Field Options
                  </div>
                  <Button
                    onClick={() => handleAddOption(activeField?.id || "")}
                    className="bg-transparent border text-black hover:bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    Add Option
                  </Button>
                </div>
                <div className="mt-4 space-y-2">
                  {activeField?.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2"
                    >
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(activeField.options || [])];
                          newOptions[index] = e.target.value;
                          updateFields(activeField.id, { options: newOptions });
                        }}
                      />

                      <div className="flex items-center gap-2">
                        <Trash
                          className="w-4 h-4 cursor-pointer text-red-500"
                          onClick={() => {
                            const newOptions = activeField.options?.filter(
                              (_, i) => i !== index
                            );
                            updateFields(activeField.id, {
                              options: newOptions,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rules" className="space-y-4">
              <div className="flex gap-2 items-center font-medium mt-4">
                <Lock className="w-5 h-5" />
                <div>Validation Rules</div>
              </div>
              <div>
                {validatedFields.includes(activeField?.type) ? (
                  <div>
                    ✅{" "}
                    <span className="capitalize font-medium">
                      {activeField?.type}{" "}
                    </span>
                    is automatically validated
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className=" space-y-2">
                      <Label>Min Length</Label>
                      <Input
                        type="number"
                        value={activeField?.minLength || 0}
                        onChange={(e) =>
                          updateFields(activeField?.id || "", {
                            minLength: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Length</Label>
                      <Input
                        type="number"
                        value={activeField?.maxLength || 0}
                        onChange={(e) =>
                          updateFields(activeField?.id || "", {
                            maxLength: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default FieldSettings;
