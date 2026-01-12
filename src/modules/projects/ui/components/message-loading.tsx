import Image from "next/image";
import { useEffect, useState } from "react"

const ShimmerMessage = () => {

    const messages = [
        "Analyzing your request...",
        "Processing information...",
        "This may take a few moments...",
        "Generating response...",
        "Almost done...",
        "Finalizing details...",
    ];

    const [currentMessageIndex, setCurrentMessage] = useState(0);

    useEffect(() => {

        if (currentMessageIndex >= messages.length - 1) return;

        const timeout = setTimeout(() => {
            setCurrentMessage((prev) => (prev + 1))
        }, 1000);

        return () => clearTimeout(timeout);
    }, [currentMessageIndex])

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentMessageIndex]}
            </span>
        </div>
    )

}

export const MessageLoading = () => {
    return (
        <div className=" flex flex-col group px-2 pb-4">
            <div className="flex  items-center gap-2 mb-2 pl-2" >
                <Image
                    src="/logo.svg"
                    alt="Assistio"
                    width={18}
                    height={18}
                />
                <span className="text-sm font-medium">
                    Assistio
                </span>
            </div>
            <div className="pl-8 flex flex-col gap-y-4" >
                <ShimmerMessage />
            </div>
        </div>
    )
}
