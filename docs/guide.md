---
layout: default
title: "Quick Start Guide"
nav_order: 2
---

# Pocket Flow Framework Quick Start Guide

{: .note }
> **Note:** This documentation currently focuses on the **TypeScript** implementation of the Pocket Flow Framework.

This guide provides a rapid introduction to the core concepts and usage patterns of the framework.

{: .important }
> The Pocket Flow Framework helps you build modular, flow-based applications by composing nodes into directed graphs.

## Core Concepts

### BaseNode
Every functional unit in a flow inherits from the abstract `BaseNode` class. Each node must implement three key lifecycle methods and a `_clone` method:

```typescript
abstract class BaseNode {
  // Prepare input data or transform shared state before core execution
  abstract prep(sharedState: any): Promise<any>;
  
  // Contains the main logic of the node
  abstract execCore(prepResult: any): Promise<any>;
  
  // Processes results, updates shared state, and determines the next step (action)
  abstract post(prepResult: any, execResult: any, sharedState: any): Promise<string>;

  // Creates a new instance of the node (required for flow execution)
  abstract _clone(): BaseNode;
}
```

The `_clone()` method is essential for the framework to manage node instances and state correctly during potentially complex or parallel executions.

### Flow Construction & Execution
Nodes are linked together to form a workflow using `addSuccessor(node, action)`. The `action` is a string label for the connection. The `post()` method of a node returns an action string, determining which successor node will execute next. `DEFAULT_ACTION` is provided as a standard action name.

Here’s a complete example:

```typescript
import { BaseNode, Flow, DEFAULT_ACTION } from "pocket"; // Assuming 'pocket' is the package name

class MyNode extends BaseNode {
  async prep(sharedState: any): Promise<any> {
    console.log("MyNode Prep:", sharedState);
    // Example: Prepare data based on shared state
    return { nodeInput: sharedState.initialData }; 
  }
  
  async execCore(prepResult: any): Promise<any> {
    console.log("MyNode ExecCore:", prepResult);
    // Example: Perform the core task
    return { resultData: `Processed: ${prepResult.nodeInput}` };
  }
  
  async post(prepResult: any, execResult: any, sharedState: any): Promise<string> {
    console.log("MyNode Post:", execResult);
    // Example: Update shared state
    sharedState.lastResult = execResult.resultData;
    // Determine the next action
    return DEFAULT_ACTION; // Proceed to the default successor
  }

  // Required for the flow to function correctly
  _clone(): BaseNode {
    return new MyNode();
  }
}

// --- Flow Setup ---

// Create node instances
const nodeA = new MyNode();
const nodeB = new MyNode(); // Another node instance

// Connect nodeA's default action to nodeB
nodeA.addSuccessor(nodeB, DEFAULT_ACTION);

// Create the flow starting with nodeA
const flow = new Flow(nodeA);

// Define initial shared state
const initialState = { initialData: "Hello PocketFlow!" };

// Run the flow
console.log("Starting flow...");
const finalState = await flow.run(initialState);
console.log("Flow finished. Final State:", finalState);
```

## Advanced Features Overview

The framework includes specialized nodes and flows for common patterns:

### RetryNode
Automatically retries execution upon failure. Extend `RetryNode` and implement the standard `prep`, `execCore`, `post`, and `_clone` methods.

```typescript
import { RetryNode } from "pocket";

class MyRetryNode extends RetryNode {
  constructor(maxRetries: number = 3, retryIntervalMs: number = 1000) {
    super(maxRetries, retryIntervalMs);
  }

  async prep(sharedState: any): Promise<any> { /* ... */ return {}; }
  async execCore(prepResult: any): Promise<any> { 
    // Example: Simulate potential failure
    if (Math.random() < 0.5) { throw new Error("Simulated failure"); }
    return { success: true }; 
  }
  async post(prepResult: any, execResult: any, sharedState: any): Promise<string> { /* ... */ return DEFAULT_ACTION; }
  _clone(): BaseNode { return new MyRetryNode(); }
}
```

### BatchFlow
Processes an array of items efficiently. Override `prep()` to return the array. The framework then typically calls `execCore()` for each item (behavior might vary based on specific `BatchFlow` implementation).

```typescript
import { BatchFlow } from "pocket"; // Assuming a base BatchFlow exists

class MyBatchFlow extends BatchFlow { // Extend the appropriate BatchFlow base
  async prep(sharedState: any): Promise<any[]> {
    // Example: Return an array of items from shared state
    return sharedState.itemsToProcess || []; 
  }

  // execCore would typically process a single item from the batch
  async execCore(singleItem: any): Promise<any> {
    console.log("Processing item:", singleItem);
    return { processedItem: singleItem * 2 }; // Example processing
  }

  // post might aggregate results or update state after batch completion
  async post(prepResult: any, execResult: any, sharedState: any): Promise<string> {
      // execResult might be an array of results from execCore calls
      sharedState.batchResults = execResult; 
      return DEFAULT_ACTION;
  }

  _clone(): BaseNode { return new MyBatchFlow(); } // Adjust as needed
}
```
*Note: The exact implementation details of `BatchFlow` might vary. Consult the specific class documentation.* 

### Shared State
- A JavaScript object passed sequentially through the nodes in a flow.
- Nodes can read from and write to the shared state during their `prep` and `post` phases.
- Allows data persistence and communication between nodes.

## Best Practices

### Node Design
- **Single Responsibility**: Keep nodes focused on one logical task.
- **Lifecycle Methods**: Use `prep()` for input/state preparation, `execCore()` for the main work, and `post()` for result processing, state updates, and determining the next action.

### Flow Management
- **Implement `_clone()`**: Ensure every node class correctly implements the `_clone()` method.
- **Meaningful Actions**: Use descriptive action strings (beyond just `DEFAULT_ACTION`) for clarity when implementing branching logic in `post()`.
- **Error Handling**: Implement error handling within nodes or use constructs like `RetryNode`.

### State Management
- **Keep it Minimal**: Avoid putting excessive or unnecessary data into the shared state.
- **Type Safety**: Use TypeScript interfaces to define the structure of your shared state for better maintainability.
- **Documentation**: Clearly document the expected structure and purpose of data within the shared state.

### Testing
- **Unit Test Nodes**: Test individual nodes in isolation by calling their lifecycle methods directly or using `node.run()` if applicable.
- **Integration Test Flows**: Test complete flows using `flow.run()` to verify node interactions and final state.
- **Verify State**: Assert that the shared state is correctly modified throughout the flow execution.
