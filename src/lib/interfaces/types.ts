export interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  properties: {
    required: boolean;
  };
  position: {
    width: number;
    height: number;
  };
}

export interface Forms {
  id: string;
  title: string;
  description: string;
  fields: Field[];
  isPublished: boolean;
  createdAt: Date;
}
