import { inngest } from "./client";
import { Sandbox } from 'e2b'
import { createAgent, gemini, createTool } from '@inngest/agent-kit'
import z from "zod";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },

  async ({ event, step }) => {

    //step 1: create a sandbox
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("v0-clone-build")
      return sandbox.sandboxId
    })

    const terminalTool = createTool({
      name: "terminal",
      description: "A tool that allows you to run terminal commands in the sandbox. Use this tool to run commands in the terminal and get the output and error.",
      parameters: z.object({
        command: z.string().describe("The command to run in the terminal")
      }),
      handler: async ({ command }, { step }) => {
        return await step?.run("terminal", async () => {
          const buffers = { stdout: "", stderr: "" }
          try {
            const sandbox = await Sandbox.connect(sandboxId)

            const result = await sandbox.commands.run(command, {
              onStdout: (data) => {
                buffers.stdout += data
              },
              onStderr: (data) => {
                buffers.stderr += data
              }
            })
            return result.stdout
          } catch (error) {
            console.log(`Command failed: ${error} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`)
            return `Command failed: ${error} \n stdout: ${buffers.stdout} \n stderr: ${buffers.stderr}`
          }
        })
      }
    })

    const codeAgent = createAgent({
      name: 'code-agent',
      description: 'An agent that can run code in a sandbox',
      system: 'You are a helpful assistant that executes code in a sandbox. You can run code in the sandbox and return the results.',
      model: gemini({ model: "gemini-1.5-flash-8b" }),
      tools: [
        //Terminal
        //create/update file
        //read file
      ]
    })
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId)
      const host = sandbox.getHost(3000)

      return `http://${host}`
    })
    return { message: `Hello World from Abhi` };
  },
);