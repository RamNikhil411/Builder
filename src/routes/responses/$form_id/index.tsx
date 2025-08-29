import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/responses/$form_id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/responses/fom_id/"!</div>;
}
