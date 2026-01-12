"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";


export default function Home() {

  const [prompt, setPrompt] = useState("");

  const router = useRouter();
  const trpc = useTRPC();

  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
    onSuccess: (data) => {
      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}`);
    },

  }));


  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex min-h-screen itemsz-center justify-center">
        <div className="w-full max-w-2xl space-y-4 px-4">
          <Input
            className="text-lg py-6"
            placeholder="Create a landing page for a coffee shop"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            className="w-full py-6 text-lg"
            disabled={createProject.isPending}
            onClick={() => createProject.mutate({ prompt })} >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
