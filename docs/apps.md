---
layout: default
title: "Apps"
nav_order: 5
has_children: true
---

# Building Applications

This guide explains how to build applications using the Pocket Flow Framework's core components.

## Core Components

### 1. Basic Nodes (BaseNode)

The fundamental building block of any Pocket Flow application is the `BaseNode`. Each node has three key lifecycle methods:

```typescript
abstract class BaseNode {
    async prep(sharedState: any): Promise<any>;     // Prepare data for execution
    async execCore(prepResult: any): Promise<any>;  // Core execution logic
    async post(prepResult: any, execResult: any, sharedState: any): Promise<string>;  // Post-processing
}
```

Example implementation:
```typescript
class DataProcessingNode extends BaseNode {
    async prep(sharedState: any) {
        return sharedState.data;
    }
    
    async execCore(prepResult: any) {
        return processData(prepResult);
    }
    
    async post(prepResult: any, execResult: any, sharedState: any) {
        sharedState.processedData = execResult;
        return "default";
    }
}
```

### 2. Flows

Flows orchestrate the execution of multiple nodes:

```typescript
const processNode = new DataProcessingNode();
const validateNode = new ValidationNode();
const modelNode = new ModelNode();

// Chain nodes together
processNode.addSuccessor(validateNode, "default");
validateNode.addSuccessor(modelNode, "default");

// Create and run the flow
const flow = new Flow(processNode);
await flow.run(sharedState);
```

### 3. Batch Processing

For parallel processing, use `BatchFlow`:

```typescript
class DataBatchFlow extends BatchFlow {
    async prep(sharedState: any) {
        // Return array of items to process in parallel
        return sharedState.items;
    }
    
    async post(prepResults: any[], results: any[], sharedState: any) {
        sharedState.processedItems = results;
        return "default";
    }
}
```

## Best Practices

1. **State Management**
   - Use `sharedState` for passing data between nodes
   - Keep node-specific parameters in `flow_params`

2. **Error Handling**
   - Implement `RetryNode` for operations that may fail
   - Use try-catch blocks in node implementations

3. **Flow Design**
   - Break complex operations into smaller nodes
   - Use meaningful action names for node transitions
   - Consider using BatchFlow for parallel processing

## Common Patterns

### 1. Retry Pattern
```typescript
class ApiNode extends RetryNode {
    constructor() {
        super(3, 1000); // 3 retries, 1 second interval
    }
    
    async execCore(prepResult: any) {
        return await apiCall(prepResult);
    }
}
```

### 2. Conditional Branching
```typescript
class ValidationNode extends BaseNode {
    async post(prepResult: any, execResult: any, sharedState: any) {
        return execResult.isValid ? "valid" : "invalid";
    }
}

validationNode.addSuccessor(successNode, "valid");
validationNode.addSuccessor(failureNode, "invalid");
```

### 3. Nested Flows
```typescript
const subFlow = new Flow(startNode);
const mainFlow = new Flow(preprocessNode);
preprocessNode.addSuccessor(subFlow, "default");
```

## Advanced Usage

### Custom Flow Parameters
```typescript
class CustomNode extends BaseNode {
    async prep(sharedState: any) {
        const params = this.flow_params;
        // Use custom parameters for this node
        return processWithParams(sharedState, params);
    }
}

const node = new CustomNode();
node.setParams({ threshold: 0.5, mode: "fast" });
```

### Parallel Processing with BatchFlow
```typescript
class ParallelProcessFlow extends BatchFlow {
    async prep(sharedState: any) {
        return sharedState.data.chunks;
    }
    
    async post(prepResults: any[], results: any[], sharedState: any) {
        sharedState.results = results.flat();
        return "default";
    }
}
```

See the child pages for detailed examples and specific use cases.