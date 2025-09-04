import React, { CSSProperties, useContext } from "react";
import { Input } from "../ui/input";
import { Field } from "~/lib/interfaces/types";
import { FormContext } from "~/context/formContext";

const Heading = ({ field }: { field: Field }) => {
  const { activeField } = useContext(FormContext);

  const isActive = activeField?.id === field?.id;
  const alignment = field?.alignment || "left";

  // Input shows if active OR empty
  const showInput = isActive || !field?.value;

  return (
    <div className="space-y-2">
      {/* Heading text */}
      <div
        style={
          {
            fontSize: `${field?.size?.heading_size || 20}px`,
            textAlign: alignment,
            fontWeight: "600",
          } as CSSProperties
        }
      >
        {field?.label}
      </div>

      {showInput ? (
        <Input
          value={field?.value || ""}
          placeholder={field?.placeholder || "Enter subheading"}
        />
      ) : (
        <div
          style={
            {
              fontSize: `${field?.size?.subheading_size || 16}px`,
              textAlign: alignment,
              color: "#555",
              minHeight: "1.5rem",
            } as CSSProperties
          }
        >
          {field?.value}
        </div>
      )}
    </div>
  );
};

export default Heading;
