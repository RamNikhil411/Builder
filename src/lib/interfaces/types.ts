export interface Field {
  id: string;
  label: string;
  title: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;

  position: {
    width: number;
    height: number;
  };
  fieldLabelProperties?: {
    color?: string;
    fontsize?: string;
    fontFamily?: string;
    textAlign?: string;
  };
  color?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Forms {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  isPublished: boolean;
  createdAt: Date;
}
