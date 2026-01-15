import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { CopyCheckIcon, CopyIcon } from "lucide-react";

import { CodeView } from "./code-view";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Hint } from "./hint";
import { Button } from "./ui/button";

export type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const parts = filename.split(".").pop()?.toLowerCase();
  return parts || "text";
}

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileNames = Object.keys(files);
    return fileNames.length > 0 ? fileNames[0] : null;
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20} minSize={15} className="bg-sidebar">
        <p>TODO: Tree view</p>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={() => {}}
                  disabled={false}
                >
                  <CopyIcon />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                lang={getLanguageFromExtension(selectedFile)}
                code={files[selectedFile]}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view it&apos;s contents.
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
