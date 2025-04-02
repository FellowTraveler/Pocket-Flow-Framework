import { createAdditionFlow, AdditionMode } from './flows/AdditionFlow.flow';

// Define the shape of our shared state
interface SharedState {
    num1: number;
    num2: number;
    result?: number;
    error?: string;
    lastNode?: string;
}

async function run() {
    // --- Configuration ---
    const mode: AdditionMode = process.env.ADDITION_MODE as AdditionMode || 'mcp'; // 'mcp' or 'local', default 'mcp'
    const num1 = 5;
    const num2 = 10;

    console.log("--- Running Addition Flow ---");
    console.log(`Mode: ${mode}`);
    console.log(`Inputs: num1=${num1}, num2=${num2}`);
    console.log("-----------------------------");

    if (mode === 'mcp') {
        console.log("INFO: Ensure the MCP server is running (e.g., 'npm run start:server' or 'npm run dev:server').");
        console.log(`INFO: MCP Server URL configured as: ${process.env.MCP_SERVER_URL || 'http://localhost:3456'}`);
    }

    // --- Create Flow ---
    const flow = createAdditionFlow({ mode });

    // --- Define Initial State ---
    const sharedState: SharedState = {
        num1: num1,
        num2: num2,
    };

    // --- Run Flow ---
    try {
        console.log("\nStarting flow execution...");
        // flow.run() returns the action string, but modifies sharedState in-place
        const action = await flow.run(sharedState);
        console.log("\nFlow execution finished.");
        console.log("-----------------------------");
        console.log("Final Shared State:", sharedState);
        console.log(`Final Action: ${action}`);
        console.log("-----------------------------");

        if (sharedState.error) {
            console.error("Flow completed with error:", sharedState.error);
        }
         else if (sharedState.result !== undefined) {
             console.log(`✅ Result (${mode}): ${sharedState.num1} + ${sharedState.num2} = ${sharedState.result}`);
         } else {
            console.warn("Flow completed but no result found in final state.");
         }

    } catch (error) {
        console.error("\n--- Flow Execution Error ---");
        console.error(error);
        console.error("----------------------------");
    }
}

run();
