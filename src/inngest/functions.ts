import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const codeAgent = createAgent({
      name: "code-agent",
      system: `You are an expert next.js developer. Write code snippets as per user requirements. If you are asked to write code, ensure that the code is syntactically correct and can run without errors.`,
      model: gemini({ model: "gemini-2.5-flash" }),
      
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.text}`
    );

    return { output };

  }

);

