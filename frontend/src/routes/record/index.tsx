import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "../../utils/auth.tsx";

export const Route = createFileRoute("/record/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/record/"!</div>;
}
