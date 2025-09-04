import { createContext, useEffect, useState } from "react";
import { Field, Forms } from "~/lib/interfaces/types";

interface FormContextProps {
  forms: Forms[];
  setForms: React.Dispatch<React.SetStateAction<Forms[]>>;
  isSaving: boolean;
  lastSavedAt: number | null;
  activeField: Field | null;
  setActiveField: React.Dispatch<React.SetStateAction<Field | null>>;
}

export const FormContext = createContext<FormContextProps>({
  forms: [],
  setForms: () => {},
  isSaving: false,
  lastSavedAt: null,
  activeField: {} as Field,
  setActiveField: () => {},
});

const FormProvider = ({ children }: any) => {
  const [forms, setForms] = useState<Forms[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<Field>({} as Field);

  useEffect(() => {
    const storedForms = localStorage.getItem("forms");
    if (storedForms) {
      setForms(JSON.parse(storedForms));
    }
  }, []);

  useEffect(() => {
    if (forms.length === 0) return;

    setIsSaving(true);
    const timeOut = setTimeout(() => {
      localStorage.setItem("forms", JSON.stringify(forms));
      setIsSaving(false);
      setLastSavedAt(Date.now());
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [forms]);

  return (
    <FormContext.Provider
      value={{
        forms,
        setForms,
        isSaving,
        lastSavedAt,
        activeField,
        setActiveField,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
