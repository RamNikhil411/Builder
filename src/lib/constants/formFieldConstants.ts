import {
  Type,
  Mail,
  Hash,
  FileText,
  ChevronDown,
  Circle,
  CheckSquare,
  Calendar,
  Upload,
  Plus,
} from "lucide-react";

export const formfields = [
  {
    name: "text",
    label: "Text",
    icon: Type,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    name: "email",
    label: "Email",
    icon: Mail,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    name: "number",
    label: "Number",
    icon: Hash,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    name: "textarea",
    label: "Textarea",
    icon: FileText,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    name: "dropdown",
    label: "Dropdown",
    icon: ChevronDown,
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  },
  {
    name: "radio_buttons",
    label: "Radio Buttons",
    icon: Circle,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  },
  {
    name: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
  },
  {
    name: "date_picker",
    label: "Date Picker",
    icon: Calendar,
    color: "bg-red-50 border-red-200 hover:bg-red-100",
  },
  {
    name: "file_upload",
    label: "File Upload",
    icon: Upload,
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
];
