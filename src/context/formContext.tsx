import { createContext, useEffect, useState } from "react";
import { Forms } from "~/lib/interfaces/types";

interface FormContextProps {
  forms: Forms[];
  setForms: React.Dispatch<React.SetStateAction<Forms[]>>;
  isSaving: boolean;
  lastSavedAt: number | null;
}

export const FormContext = createContext<FormContextProps>({
  forms: [],
  setForms: () => {},
  isSaving: false,
  lastSavedAt: null,
});

const FormProvider = ({ children }: any) => {
  const [forms, setForms] = useState<Forms[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

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
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormProvider;
