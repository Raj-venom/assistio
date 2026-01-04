"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function Home() {

  const [prompt, setPrompt] = useState("");
  const trpc = useTRPC();

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created successfully", { duration: 2000 });
    }
  }))


  return (
    <div>
      <Toaster />
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-2xl space-y-4 px-4">
          <Input
            className="text-lg py-6"
            placeholder="Create a landing page for a coffee shop"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="w-full py-6 text-lg"
            disabled={createMessage.isPending}
            onClick={() => createMessage.mutate({ prompt })} >
            Submit
          </Button>
        </div>

        <div className="absolute top-4 right-4 w-80 max-w-full space-y-2">
          {messages?.map((message) => (
            <div>
              <div key={message.id} className="rounded-md border p-4 shadow-sm">
                <p className="text-sm">{message.content}</p>
              </div>

            </div>





          ))}
        </div>
      </div>
    </div>
  );
}
