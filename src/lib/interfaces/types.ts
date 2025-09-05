import { Answer } from "~/components/builder/Formpreview";

export interface Field {
  id: string;
  name: string;
  label: string;
  title: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  position: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  fieldLabelProperties?: {
    color?: string;
    fontsize?: string;
    fontFamily?: string;
    textAlign?: string;
  };
  color?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  value?: string;
  size?: {
    heading_size?: number;
    subheading_size?: number;
  };
  alignment?: string;
  accept?: string;
}

export interface Submission {
  answers: Answer[];
  submittedAt: Date;
}

export interface Forms {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  isPublished: boolean;
  createdAt: Date;
  answers: Submission[];
  updatedAt: Date;
}
