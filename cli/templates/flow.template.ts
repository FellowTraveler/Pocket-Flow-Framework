import { Flow, DEFAULT_ACTION } from "pocket"; // Adjust the import path as needed
// Import your Node classes here
// import { MyNode1 } from '../nodes/MyNode1.node'; 
// import { MyNode2 } from '../nodes/MyNode2.node';

/**
 * Creates and configures the {{FlowName}}.
 * 
 * @param {any} config - Optional configuration parameters for the flow or its nodes.
 * @returns {Flow} An instance of the configured Flow.
 */
export function create{{FlowName}}(config?: any): Flow {
  console.log(`Creating {{FlowName}} with config:`, config);

  // --- Instantiate Nodes ---
  // Replace with your actual node instances
  // const node1 = new MyNode1(/* node config */);
  // const node2 = new MyNode2(/* node config */);
  // const startNode = node1; // Define the starting node

  // --- Connect Nodes ---
  // Define the sequence and branching logic
  // Example: node1.addSuccessor(node2, DEFAULT_ACTION);
  // Example: node1.addSuccessor(errorHandlingNode, "errorAction");

  // --- Create Flow ---
  if (!startNode) {
    throw new Error("Start node must be defined for the flow!");
  }
  const flow = new Flow(startNode);

  console.log(`{{FlowName}} created successfully.`);
  return flow;
}

/**
 * Example function to run the {{FlowName}}.
 * 
 * @param {any} initialState - The initial shared state to start the flow with.
 * @param {any} [config] - Optional configuration to pass to create{{FlowName}}.
 * @returns {Promise<any>} The final shared state after the flow completes.
 */
export async function run{{FlowName}}(initialState: any, config?: any): Promise<any> {
  const flow = create{{FlowName}}(config);
  
  console.log(`Running {{FlowName}} with initial state:`, initialState);
  const finalState = await flow.run(initialState);
  console.log(`{{FlowName}} finished. Final state:`, finalState);
  
  return finalState;
}

// --- Example Usage (Optional) ---
/*
async function example() {
  const initialState = {
    // Define your initial state properties
    input: "Sample Data"
  };

  try {
    const result = await run{{FlowName}}(initialState);
    // Process the final result
  } catch (error) {
    console.error("Error running {{FlowName}}:", error);
  }
}

// Uncomment to run the example when this file is executed directly
// example();
*/
