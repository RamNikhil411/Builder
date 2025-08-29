import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/builder/form_id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/builder/form_id/"!</div>
}
