import { createFileRoute } from "@tanstack/react-router";
import FormResponses from "~/components/builder/FormResponses";

export const Route = createFileRoute("/responses/$form_id/")({
  component: FormResponses,
});
