import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranklist/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ranklist/"!</div>
}
