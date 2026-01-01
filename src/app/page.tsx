"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function Home() {

  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))


  return (
    <div>
      <div className="flex min-h-screen items-center justify-center">
        <Button onClick={() => invoke.mutate({text: "Raj9824"})} >
          Invoke Background Task
        </Button>
      </div>
    </div>
  );
}
