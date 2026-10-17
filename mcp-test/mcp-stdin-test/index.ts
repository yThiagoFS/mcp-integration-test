import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    version: "1.0.0",
    name: "My MCP Server"
});

server.registerTool("generate_random_number", {
    description: "Generates a random number"
}, async () => {
    const outputNumber = Math.floor(Math.random() * 10000);

    return {
        content: [
            {
                type: "text",
                text: `Random number: ${outputNumber}`
            }
        ]
    }
});

server.registerTool("generate_a_limited_random_number", {
    description: "Generates a limited random number given the user input or a default limit.",
    inputSchema: {
        limit: z.number().optional().describe("limit")
    }
}, async ({ limit }) => {
    const outputNumber = Math.floor(Math.random() * (limit || 1000)) 

    return {
        content: [
            {
                type: "text",
                text: `Random Number: ${outputNumber}`
            }
        ]
    }
})

const transport = new StdioServerTransport();
await server.connect(transport);