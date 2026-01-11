import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextareaAutoSize from "react-textarea-autosize";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface MessageFormProps {
    projectId: string;
}


const messageFormSchema = z.object({
    prompt: z
        .string()
        .min(1, { message: "Prompt is required" })
        .max(1000, { message: "Prompt must be at most 1000 characters" }),
});


export default function MessageForm({ projectId }: MessageFormProps) {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof messageFormSchema>>({
        resolver: zodResolver(messageFormSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: () => {
            form.reset();
            queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({
                projectId,
            }))
        },
        onError: (error) => {
            toast.error(`${error.message}`);
            // TODO: redirect to pricing page if not enough credits
        }
    }));

    const onSubmit = async (data: z.infer<typeof messageFormSchema>) => {
        await createMessage.mutateAsync({
            prompt: data.prompt,
            projectId,
        })
    };

    const [isFocused, setIsFocused] = useState(false);
    const [showUsage, setShowUsage] = useState(false);
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all ",
                    isFocused && "shadow-xs",
                    showUsage && "rounded-t-none"
                )}>
                <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                        <TextareaAutoSize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            placeholder="Build a todo app with React and TypeScript..."
                            className="pt-4 resize-none border-none w-full outline-none bg-transparent "
                            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                }
                            }}
                        />
                    )}
                />
                <div className="flex gap-x-2 items-end justify-between pt-2">
                    <div className="text-[10px] text-muted-foreground font-mono" >
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span>&#8984;</span>Enter
                        </kbd>
                        &nbsp;to submit
                    </div>
                    <Button
                        className={cn(
                            "size-8 rounded-full",
                            isButtonDisabled && "bg-muted-foreground border"
                        )}
                        disabled={isButtonDisabled}
                    >
                        {isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <ArrowUpIcon />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
