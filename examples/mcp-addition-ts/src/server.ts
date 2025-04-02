import express, { Request, Response } from 'express';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.MCP_PORT || 3456; // Changed default port to 3456

interface MCPRequest {
    toolName: string;
    arguments: any; // Simple structure for demo
}

interface MCPResponse {
    result?: any;
    error?: string;
}

// --- Tool Implementations ---
function add(a: number, b: number): number {
    console.log(`[MCP Server] Executing tool 'add' with args: ${a}, ${b}`);
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error("Invalid arguments for add: both must be numbers.");
    }
    return a + b;
}

// --- MCP Endpoint ---
app.post('/mcp/call', (req: Request, res: Response) => {
    const { toolName, arguments: args }: MCPRequest = req.body;
    let response: MCPResponse;

    console.log(`[MCP Server] Received request for tool: ${toolName}`);

    try {
        switch (toolName) {
            case 'add':
                // Basic argument handling for demo
                const { a, b } = args;
                const result = add(a, b);
                response = { result };
                break;
            default:
                console.warn(`[MCP Server] Unknown tool requested: ${toolName}`);
                response = { error: `Tool '${toolName}' not found.` };
                res.status(404);
                break;
        }
    } catch (error) {
        console.error(`[MCP Server] Error executing tool '${toolName}':`, error);
        response = { error: error instanceof Error ? error.message : 'Unknown error occurred' };
        res.status(500);
    }

    console.log(`[MCP Server] Sending response:`, response);
    res.json(response);
});

app.get('/', (req: Request, res: Response) => {
    res.send('MCP Server is running. POST to /mcp/call to use tools.');
});

app.listen(PORT, () => {
    console.log(`MCP Server listening on port ${PORT}`);
    console.log(`Available tools: add(a, b)`);
});
