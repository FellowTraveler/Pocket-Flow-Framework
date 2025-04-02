import { Flow, DEFAULT_ACTION, BaseNode } from "../pocket-local";
import { MCPAdditionNode } from '../nodes/MCPAdditionNode.node';
import { LocalAdditionNode } from '../nodes/LocalAdditionNode.node';

export type AdditionMode = 'mcp' | 'local';

interface AdditionFlowConfig {
    mode: AdditionMode;
}

/**
 * Creates an Addition Flow that uses either MCP or Local addition.
 * @param config Configuration object, requires `mode: 'mcp' | 'local'`.
 * @returns A configured Flow instance.
 */
export function createAdditionFlow(config: AdditionFlowConfig): Flow {
    console.log(`Creating Addition Flow in '${config.mode}' mode.`);

    let startNode: BaseNode;

    if (config.mode === 'mcp') {
        startNode = new MCPAdditionNode();
    } else if (config.mode === 'local') {
        startNode = new LocalAdditionNode();
    } else {
        throw new Error(`Invalid mode specified: ${config.mode}. Use 'mcp' or 'local'.`);
    }

    // Simple flow: only one node
    // For more complex flows, add successors here:
    // const nextNode = new SomeOtherNode();
    // startNode.addSuccessor(nextNode, DEFAULT_ACTION);

    const flow = new Flow(startNode);
    console.log("Addition Flow created.");
    return flow;
}
