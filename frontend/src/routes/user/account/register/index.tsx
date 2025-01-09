import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/account/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mx-auto w-3/5 mt-4 h-[70vh] bg-white">
        Hello "/user/account/register/"!
      </div>
    </>
  );
}
