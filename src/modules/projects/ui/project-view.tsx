"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { Suspense, useState } from "react";
import { MessagesContainer } from "./components/messages-container";
import { Fragment } from "@/generated/prisma/client";
import { ProjectHeader } from "./components/project-header";


interface Props {
    projectId: string;
}


export const ProjectView = ({ projectId }: Props) => {
    // const trpc = useTRPC();

    // const { data: project } = useSuspenseQuery(
    //     trpc.projects.getOne.queryOptions({
    //         id: projectId,
    //     }),
    // )

    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);



    return (
        <div className="h-screen" >
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={25}
                    minSize={20}
                    className="flex flex-col min-h-0"
                >
                    <Suspense fallback={<div>Loading Project...</div>}>
                    <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<div>Loading Messages...</div>}>
                        <MessagesContainer
                         projectId={projectId}
                         activeFragment={activeFragment}
                         setActiveFragment={setActiveFragment}
                         />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={75}
                    minSize={50}
                >
                    TODO : Web PreView
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )

}