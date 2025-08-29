import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preview/$form_id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/preview/form_id/"!</div>
}
