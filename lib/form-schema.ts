export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "checkboxGroup"
  | "textarea"
  | "currency"
  | "file"
  | "yesno";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: Record<string, unknown>;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormTemplateSchema {
  steps: FormStep[];
  settings?: {
    progressIndicator?: "steps" | "percentage" | "none";
    requireAuth?: boolean;
    allowFileUpload?: boolean;
  };
}
