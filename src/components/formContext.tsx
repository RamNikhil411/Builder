import { createContext, useState } from "react";
import { Field, Forms } from "~/lib/interfaces/types";

interface FormContextProps {
  forms: Forms[];
  setForms: React.Dispatch<React.SetStateAction<Forms[]>>;
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
}

export const FormContext = createContext<FormContextProps>({
  forms: [],
  setForms: () => {},
  fields: [],
  setFields: () => {},
});

const FormProvider = ({ children }: any) => {
  const [forms, setForms] = useState<Forms[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  return (
    <FormContext.Provider
      value={{
        forms,
        setForms,
        fields,
        setFields,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
