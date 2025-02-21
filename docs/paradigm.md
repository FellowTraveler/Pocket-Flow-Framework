---
layout: default
title: "Paradigm"
nav_order: 4
has_children: true
---

# Core Paradigms

The Pocket Flow Framework is built around several key paradigms that enable flexible and powerful workflow orchestration.

## 1. Node-Based Processing

The fundamental unit of computation is the `BaseNode`, which follows a three-phase execution pattern:

```typescript
abstract class BaseNode {
    async prep(sharedState: any): Promise<any>;     // Prepare data
    async execCore(prepResult: any): Promise<any>;  // Execute core logic
    async post(prepResult: any, execResult: any, sharedState: any): Promise<string>;  // Post-process
}
```

This pattern enables:
- Clear separation of concerns
- Predictable data flow
- Flexible state management

## 2. Action-Based Transitions

Nodes connect through action-based transitions, where each node's `post()` method returns an action string that determines the next node:

```typescript
// Define transitions based on actions
nodeA.addSuccessor(nodeB, "success");
nodeA.addSuccessor(errorNode, "error");
```

This enables:
- Dynamic workflow paths
- Conditional branching
- Error handling patterns

## 3. Shared State Management

The framework uses a shared state object that flows through the entire execution:

```typescript
// Each node can read/write to shared state
async post(prepResult: any, execResult: any, sharedState: any): Promise<string> {
    sharedState.results.push(execResult);
    return "default";
}
```

## 4. Flow Composition

Flows can be nested and composed, treating complex workflows as single nodes:

```typescript
// Create a sub-flow
const subFlow = new Flow(startNode);

// Use it in a larger flow
mainFlow.addSuccessor(subFlow);
```

## 5. Parallel Processing

The `BatchFlow` enables parallel processing of multiple items:

```typescript
class BatchFlow extends Flow {
    async prep(sharedState: any): Promise<any[]> {
        return sharedState.items; // Return array of items to process
    }

    async post(prepResults: any[], results: any[], sharedState: any): Promise<string> {
        sharedState.results = results;
        return DEFAULT_ACTION;
    }
}
```

## 6. Error Handling

The framework provides built-in retry mechanisms through `RetryNode`:

```typescript
class ApiNode extends RetryNode {
    constructor() {
        super(3, 1000); // 3 retries, 1 second interval
    }
}
```

## 7. Parameter Management

Each node can maintain its own parameters separate from shared state:

```typescript
class CustomNode extends BaseNode {
    constructor() {
        super();
        this.setParams({ threshold: 0.5 });
    }
}
```

## 8. Clone and Race Condition Prevention

The framework handles parallel execution safely through node cloning:

```typescript
public clone(): BaseNode {
    const newNode = this._clone();
    newNode.flow_params = cloneDeep(this.flow_params);
    newNode.successors = new Map(this.successors);
    return newNode;
}
```

## Summary

These paradigms work together to provide:
- **Modularity**: Each node is independent and reusable
- **Flexibility**: Workflows can be dynamically constructed
- **Scalability**: Parallel processing and composition
- **Reliability**: Built-in error handling and state management
- **Safety**: Race condition prevention in parallel execution

See the child pages for detailed implementations of each paradigm.