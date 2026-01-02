"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {

  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))


  return (
    <div>
      <div className="flex min-h-screen items-center justify-center">
        <div>
        <Input
         placeholder="Enter text to invoke background task" 
         value={value}
         onChange={(e) => setValue(e.target.value)}
         />
        <Button onClick={() => invoke.mutate({text: value})} >
          Invoke Background Task
        </Button>
         </div>
      </div>
    </div>
  );
}
