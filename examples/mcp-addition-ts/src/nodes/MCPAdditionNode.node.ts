import { BaseNode, DEFAULT_ACTION } from "../pocket-local";
import axios from 'axios';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3456'; // Updated port to 3456

interface MCPAdditionNodeState {
    num1: number;
    num2: number;
    mcpServerUrl?: string; // Optional override via state
}

interface MCPAdditionExecResult {
    sum?: number;
    error?: string;
}

export class MCPAdditionNode extends BaseNode {
    async prep(sharedState: MCPAdditionNodeState): Promise<MCPAdditionNodeState> {
        console.log("[MCPAdditionNode Prep]");
        // Simple prep: just pass state through, could add validation
        if (typeof sharedState.num1 !== 'number' || typeof sharedState.num2 !== 'number') {
            throw new Error("Input state requires num1 and num2 to be numbers.");
        }
        return sharedState;
    }

    async execCore(prepResult: MCPAdditionNodeState): Promise<MCPAdditionExecResult> {
        console.log("[MCPAdditionNode ExecCore]");
        const serverUrl = prepResult.mcpServerUrl || MCP_SERVER_URL;
        const endpoint = `${serverUrl}/mcp/call`;
        const payload = {
            toolName: 'add',
            arguments: {
                a: prepResult.num1,
                b: prepResult.num2,
            },
        };

        console.log(`[MCPAdditionNode] Calling MCP server at ${endpoint} with payload:`, payload);

        try {
            const response = await axios.post<{ result?: any; error?: string }>(endpoint, payload);
            console.log("[MCPAdditionNode] Received MCP response:", response.data);

            if (response.data.error) {
                return { error: `MCP Error: ${response.data.error}` };
            }
            if (typeof response.data.result !== 'number') {
                return { error: 'MCP returned non-numeric result for add tool' };
            }
            return { sum: response.data.result };

        } catch (error: any) {
            let errorMessage = 'Failed to call MCP server';
            if (axios.isAxiosError(error)) {
                errorMessage = `Axios Error: ${error.message}${error.response ? ` (Status: ${error.response.status})` : ''}`;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            console.error("[MCPAdditionNode] Error calling MCP:", errorMessage);
            return { error: errorMessage };
        }
    }

    async post(prepResult: MCPAdditionNodeState, execResult: MCPAdditionExecResult, sharedState: any): Promise<string> {
        console.log("[MCPAdditionNode Post]");
        if (execResult.error) {
            console.error("[MCPAdditionNode] Failed:", execResult.error);
            sharedState.error = execResult.error;
            // Decide on error action if needed, e.g., return "errorAction";
        } else {
            sharedState.result = execResult.sum;
            console.log(`[MCPAdditionNode] Stored result: ${sharedState.result}`);
        }
        sharedState.lastNode = 'MCPAdditionNode';
        return DEFAULT_ACTION;
    }

    _clone(): BaseNode {
        return new MCPAdditionNode();
    }
}
