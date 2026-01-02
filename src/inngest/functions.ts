import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from '@e2b/code-interpreter'
import { getSandBox } from "./utils";



export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("assistio-nextjs-template-1");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system: `You are an expert next.js developer. Write code snippets as per user requirements. If you are asked to write code, ensure that the code is syntactically correct and can run without errors.`,
      model: gemini({ model: "gemini-2.5-flash" }),
      
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.text}`
    );

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandBox(sandboxId);
      const host =  sandbox.getHost(3000); 
      return `http://${host}`;
    });
     
    
    return { output, sandboxUrl };

  }

);

