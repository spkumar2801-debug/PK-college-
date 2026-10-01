import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/campus-life")({
  beforeLoad: () => {
    throw redirect({
      to: "/facilities",
    });
  },
});
