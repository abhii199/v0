import { inngest } from "./client";
import { Sandbox } from 'e2b'
import { createAgent, gemini, createTool } from '@inngest/agent-kit'
import z, { json } from "zod";
import { err } from "inngest/types";

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

    const createOrUpdateFileTool = createTool({
      name: "create-or-update-file",
      description: "A tool that allows you to create or update a file in the sandbox. Use this tool to create a new file or update an existing file with new content.",
      parameters: z.object({
        files: z.array(
          z.object({
            path: z.string().describe("The path of the file to create or update"),
            content: z.string().describe("The content to write to the file")
          })
        )
      }),
      handler: async ({ files }, { step, network }) => {
        const newFiles = await step?.run("create-or-update-file", async () => {
          try {
            const updatedFiles = network?.state.data.files || {}

            const sandbox = await Sandbox.connect(sandboxId)

            for (const file of files) {
              await sandbox.files.write(file.path, file.content)
              updatedFiles[file.path] = file.content
            }
            return updatedFiles
          } catch (error) {
            return "Error" + error
          }
        })
        if (typeof newFiles === 'object') {
          network.state.data.files = newFiles
        }
      }
    })

    const readFileTool = createTool({
      name: "readFile",
      description: "A tool that allows you to read a file in the sandbox.",
      parameters: z.object({
        z.array(z.string().describe("The path of the file to read"))
      }),
      handler: async ({ files }, { step }) => {
        return await step?.run("readFile", async () => {
          try {
            const sandbox = await Sandbox.connect(sandboxId)

            const contents = []

            for (const file of files) {
              const content = await sandbox.files.read(file)
              contents.push({ path: file, content })
            }
            return JSON.stringify(contents)
          } catch (error) {
            return "Error" + error
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
        terminalTool,
        createOrUpdateFileTool,
        readFileTool
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