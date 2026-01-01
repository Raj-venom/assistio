import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("download-the-video", "5s");

    // transcript the video
    await step.sleep("transcript-the-video", "5s");

    // summarize the video
    await step.sleep("summarize-the-video", "5s");
   
    return { message: `Hello ${event.data?.email ?? "Guest"}!` };
  },
);