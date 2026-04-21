import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Simple hello world style example that says hello to a given name",
  args: {
    name: tool.schema.string().describe("Name to say hello to"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/dummy.py")
    const result = await Bun.$`python3 ${script} ${args.name}`.text()
    return result.trim()
  },
})
