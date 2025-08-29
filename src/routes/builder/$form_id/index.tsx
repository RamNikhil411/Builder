import { createFileRoute } from "@tanstack/react-router";
import Builder from "~/components/builder";

export const Route = createFileRoute("/builder/$form_id/")({
  component: Builder,
});
