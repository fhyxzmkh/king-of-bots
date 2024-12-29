import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/bot/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/user/bot/"!</div>
}