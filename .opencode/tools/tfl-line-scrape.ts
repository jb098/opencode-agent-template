import { tool, ToolContext, ToolResult } from "@opencode-ai/plugin";

// 1. Define an interface for the expected response
interface ServiceType {
  "$type": string;
  name: string;
  uri: string;
}

interface TFLLine {
  "$type": string;
  id: string;
  name: string;
  modeName: string;
  created: string; // Using string for ISO dates
  modified: string;
  serviceTypes: ServiceType[]; 
  disruptions: any[];
  lineStatuses: any[];
  routeSections: any[];
  crowding: {
    "$type": string;
  };
}

// 2. Describe tool
export const getLineInformation = tool({
  description: 'A function designed to retrieve information on a given public transport line in London.',
  args: {
  line: tool.schema.string().describe('Line could be a tube line, a bus route or other named line.' + 
    ' Examples of the line argument might be something like "central" or "piccadilly", while bus ' + 
    'lines will be something like "N11".'),
  },
  async execute(args, context: ToolContext): Promise<ToolResult> {
    // 3. Make the API call
    const url = `https://api.tfl.gov.uk/Line/${args.line}`;
    const response = await fetch(url);

    // 4. Handle errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5. Parse the JSON and cast it to your interface
    const data = await response.json() as TFLLine;
    return {
      output: JSON.stringify(data),
    };
    },
})
