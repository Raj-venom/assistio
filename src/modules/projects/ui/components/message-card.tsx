import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Fragment } from "@/generated/prisma/client";
import { MessageRole, MessageType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";

interface MessageCardProps {
    content: string;
    role: MessageRole;
    fragment?: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

interface UserMessageProps {
    content: string;
}

interface AssistantMessageProps {
    content: string;
    fragment?: Fragment | null;
    createdAt: Date;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
    type: MessageType;
}

interface FragmentCardProps {
    fragment: Fragment;
    isActiveFragment: boolean;
    onFragmentClick: (fragment: Fragment) => void;
}

const UserMessage = ({ content }: UserMessageProps) => {
    return (
        <div className="flex justify-end pb-4 pr-2 pl-10">
            <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] wrap-break-words">
                {content}
            </Card>
        </div>
    )
}

const FragmentCard = ({
    fragment,
    isActiveFragment,
    onFragmentClick,
}: FragmentCardProps) => {
    return (
        <Button
            variant="ghost"
            className={cn(
                "flex items-start justify-start text-left gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors h-auto",
                isActiveFragment && "bg-primary text-primary-foreground hover:text-primary-foreground/80 border-primary hover:bg-primary"
            )}
            onClick={() => onFragmentClick(fragment)}
        >
            <Code2Icon className="size-4 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="text-sm font-medium line-clamp-1">
                    {fragment.title}
                </span>
                <span className="text-xs text-muted-foreground">Preview</span>
            </div>
            <ChevronRightIcon className="size-4 mt-0.5 shrink-0" />
        </Button>
    )
}


const AssistantMessage = ({
    content,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}: AssistantMessageProps) => {
    return (
        <div className={cn(
            "flex flex-col group px-2 pb-4",
            type === MessageType.ERROR && "text-red-700 dark:text-red-500"
        )}>
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                    src="/logo.svg"
                    alt="Assistio"
                    width={18}
                    height={18}
                    className="shrink-0"
                />
                <span className="text-sm font-medium" >Assistio </span>
                <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 " >
                    {format(createdAt, "HH:mm 'on' MMMM dd, yyyy")}
                </span>
            </div>
            <div className="pl-8 flex flex-col gap-y-4" >
                <span>{content}</span>
                {fragment && type === MessageType.RESULT && (
                    <FragmentCard
                        fragment={fragment}
                        isActiveFragment={isActiveFragment}
                        onFragmentClick={onFragmentClick}
                    />
                )}
            </div>

        </div>
    )
}




export const MessageCard = ({
    content,
    role,
    fragment,
    createdAt,
    isActiveFragment,
    onFragmentClick,
    type,
}: MessageCardProps) => {

    if (role === MessageRole.ASSISTANT) {
        return (
            <AssistantMessage
                content={content}
                fragment={fragment}
                createdAt={createdAt}
                isActiveFragment={isActiveFragment}
                onFragmentClick={onFragmentClick}
                type={type}
            />
        )
    }

    return (
        <UserMessage content={content} />
    )

}