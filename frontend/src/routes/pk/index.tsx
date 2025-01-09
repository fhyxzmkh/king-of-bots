import { createFileRoute, redirect } from "@tanstack/react-router";
import { GameMap } from "../../components/GameMap.jsx";
import { isAuthenticated } from "../../utils/auth.tsx";

export const Route = createFileRoute("/pk/")({
  beforeLoad: async () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/user/account/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mx-auto w-3/5 mt-4 h-[70vh]">
        <GameMap />
      </div>
    </>
  );
}
