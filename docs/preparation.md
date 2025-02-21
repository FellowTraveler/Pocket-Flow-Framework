---
layout: default
title: "Details"
nav_order: 3
has_children: true
---

# Implementation Details

This section covers important implementation details for working with the Pocket Flow Framework.

## Core Components

### 1. BaseNode

The `BaseNode` class is the foundation of the framework. Every node must implement these key methods:

```typescript
abstract class BaseNode {
    // Prepare data for execution
    abstract prep(sharedState: any): Promise<any>;

    // Core execution logic
    abstract execCore(prepResult: any): Promise<any>;

    // Post-processing and determine next action
    abstract post(prepResult: any, execResult: any, sharedState: any): Promise<string>;

    // Required for cloning in parallel execution
    abstract _clone(): BaseNode;
}
```

### 2. Flow Parameters

Each node can maintain its own parameters:

```typescript
class BaseNode {
    public flow_params: any;

    public setParams(params: any): void {
        this.flow_params = params;
    }
}
```

### 3. Node Transitions

Nodes connect through action-based transitions:

```typescript
class BaseNode {
    public successors: Map<string, BaseNode>;

    public addSuccessor(newSuccessor: BaseNode, action: string = "default"): void {
        if (this.successors.has(action)) {
            throw new Error(`Action ${action} already exists`);
        }
        this.successors.set(action, newSuccessor);
    }

    public getSuccessor(name: string): BaseNode | undefined {
        if (!this.successors.has(name)) {
            return undefined;
        }
        return this.successors.get(name)!.clone();
    }
}
```

### 4. Execution Wrapper

The framework supports custom execution wrappers for additional functionality:

```typescript
class BaseNode {
    public execWrapper(prepResult: any): Promise<any> {
        return this.execCore(prepResult);
    }
}

// Example: RetryNode implementation
abstract class RetryNode extends BaseNode {
    constructor(maxRetries: number, intervalMs: number) {
        super();
        this.maxRetries = maxRetries;
        this.intervalMs = intervalMs;
    }

    public async execWrapper(prepResult: any): Promise<any> {
        for (let i = 0; i < this.maxRetries; i++) {
            try {
                return await this.execCore(prepResult);
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, this.intervalMs));
            }
        }
        throw new Error("Max retries reached after " + this.maxRetries + " attempts");
    }
}
```

### 5. Flow Orchestration

The `Flow` class manages node execution:

```typescript
class Flow extends BaseNode {
    private start: BaseNode;

    async orchestrate(sharedState: any, flowParams?: any): Promise<any> {
        let currentNode: BaseNode | undefined = await this.getStartNode();
        while (currentNode) {
            currentNode.setParams((flowParams) ? flowParams : this.flow_params);
            const action = await currentNode.run(sharedState);
            currentNode = currentNode.getSuccessor(action);
        }
    }
}
```

### 6. Parallel Processing

`BatchFlow` enables parallel execution:

```typescript
class BatchFlow extends Flow {
    async run(sharedState: any): Promise<string> {
        const prepResultList = await this.prep(sharedState);
        const resultPromises = [];
        
        for (const prepResult of prepResultList) {
            const result = this.orchestrate(sharedState, prepResult);
            resultPromises.push(result);
        }
        
        const resultList = await Promise.all(resultPromises);
        return this.post(prepResultList, resultList, sharedState);
    }
}
```

## Best Practices

1. **Clone Implementation**
   - Always implement `_clone()` for your custom nodes
   - Use deep cloning for mutable state
   - Ensure thread safety in parallel execution

2. **Error Handling**
   - Use `RetryNode` for unreliable operations
   - Implement appropriate error actions in `post()`
   - Handle errors at the flow level

3. **State Management**
   - Use `flow_params` for node-specific configuration
   - Use `sharedState` for cross-node data sharing
   - Clone objects when needed to prevent mutation issues

4. **Flow Design**
   - Keep nodes focused on single responsibilities
   - Use meaningful action names
   - Consider parallel processing opportunities

See the child pages for specific implementation examples and patterns.