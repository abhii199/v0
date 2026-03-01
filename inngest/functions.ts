import { inngest } from "./client";
import { Sandbox } from 'e2b'

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },

  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("v0-clone-build")
      return sandbox.sandboxId
    })

    await step.sleep("wait-a-moment", "1s");
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId)
      const host = sandbox.getHost(3000)

      return `http://${host}`
    })
    return { message: `Hello World from Abhi` };
  },
);