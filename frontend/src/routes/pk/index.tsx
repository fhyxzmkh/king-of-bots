import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pk/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pk/"!</div>
}
