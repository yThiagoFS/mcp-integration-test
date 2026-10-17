import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";

function getServer() {
    const mcpServer = new McpServer({
        name: "Streamable MCP",
        version: "1.0.0"
    });

    mcpServer.registerTool("greet_random_time",
        {
            description: "Gives greetings according to random time of the day",
        },
        async () => {
            const times = ["Morning", "Afternoon", "Night"];

            return {
                content: [
                    {
                        type: "text",
                        text: `Good ${times[Math.floor(Math.random() * times.length)]}! How are you?`
                    }
                ]
            }
        }
    );

    mcpServer.registerTool("greet_by_name_and_time",
        {
            description: "Gives Greetings according to the user name and the time of the day",
            inputSchema: { name: z.string(), timeOfTheDay: z.string() }
        },
        async ({ name, timeOfTheDay }) => {
            return {
                content: [{
                    type: "text",
                    text: `Good ${timeOfTheDay}, ${name}! How're you?`
                }]
            }
        }
    );

    return mcpServer;
}

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
    const mcpServer = getServer();
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
    });
    res.on("close", () => {
        transport.close();
        mcpServer.close();
    });
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

app.listen(3000);
