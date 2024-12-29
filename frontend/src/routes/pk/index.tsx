import { createFileRoute } from "@tanstack/react-router";
import { GameMap } from "../../components/GameMap.jsx";

export const Route = createFileRoute("/pk/")({
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
