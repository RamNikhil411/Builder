import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/responses/fom_id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/responses/fom_id/"!</div>
}
