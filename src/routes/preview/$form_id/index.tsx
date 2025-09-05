import { createFileRoute } from "@tanstack/react-router";
import FormPreview from "~/components/builder/Formpreview";

export const Route = createFileRoute("/preview/$form_id/")({
  component: FormPreview,
});
