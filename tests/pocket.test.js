"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pocket_1 = require("../src/pocket");
const testNodes_1 = require("../src/testNodes");
describe("Basic Flow Tests", () => {
    test("Flow not allowed to execute directly", async () => {
        const flow = new pocket_1.Flow(new testNodes_1.HelloNode());
        await expect(flow.execCore({})).rejects.toThrow("Flow node does not support direct execution");
    });
    test("Flow with HelloNode and WordNode", async () => {
        // Create a simple flow that starts with HelloNode and follows with a WordNode branch
        const hello = new testNodes_1.HelloNode();
        const nodeA = new testNodes_1.WordNode("a");
        // By default HelloNode's post returns "a"
        hello.addSuccessor(nodeA, "a");
        const flow = new pocket_1.Flow(hello);
        const result = await flow.run({});
        // The Flow run method returns the result of Flow.post, which in our Flow always returns DEFAULT_ACTION
        expect(result).toBe(pocket_1.DEFAULT_ACTION);
    });
    test("Adding duplicate successor should throw an error", () => {
        const hello = new testNodes_1.HelloNode();
        const nodeA = new testNodes_1.WordNode("a");
        hello.addSuccessor(nodeA, "a");
        expect(() => {
            // Trying to add a second successor with the same action key "a"
            hello.addSuccessor(new testNodes_1.WordNode("b"), "a");
        }).toThrow();
    });
});
// ===================
// Math Flow Tests
// ===================
// Define new node types that operate on a shared state's numeric "value"
class AddNode extends pocket_1.BaseNode {
    constructor(addend) {
        super();
        this.addend = addend;
    }
    _clone() {
        return new AddNode(this.addend);
    }
    async prep(sharedState) {
        if (typeof sharedState.value !== 'number') {
            throw new Error("Shared state does not have a numeric 'value'");
        }
        console.log(`AddNode prep: ${sharedState.value} + ${this.addend}`);
        sharedState.value += this.addend;
        console.log(`AddNode result: ${sharedState.value}`);
        return sharedState;
    }
    async execCore(prepResult) {
        // Return the updated value with no further changes
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
class MultiplyNode extends pocket_1.BaseNode {
    constructor(factor) {
        super();
        this.factor = factor;
    }
    _clone() {
        return new MultiplyNode(this.factor);
    }
    async prep(sharedState) {
        if (typeof sharedState.value !== 'number') {
            throw new Error("Shared state does not have a numeric 'value'");
        }
        console.log(`MultiplyNode prep: ${sharedState.value} * ${this.factor}`);
        sharedState.value *= this.factor;
        console.log(`MultiplyNode result: ${sharedState.value}`);
        return sharedState;
    }
    async execCore(prepResult) {
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
class SubtractNode extends pocket_1.BaseNode {
    constructor(decrement) {
        super();
        this.decrement = decrement;
    }
    _clone() {
        return new SubtractNode(this.decrement);
    }
    async prep(sharedState) {
        if (typeof sharedState.value !== 'number') {
            throw new Error("Shared state does not have a numeric 'value'");
        }
        console.log(`SubtractNode prep: ${sharedState.value} - ${this.decrement}`);
        sharedState.value -= this.decrement;
        console.log(`SubtractNode result: ${sharedState.value}`);
        return sharedState;
    }
    async execCore(prepResult) {
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
// Add this class before the Math Flow Tests section
class CheckPositiveNode extends pocket_1.BaseNode {
    async prep(sharedState) {
        if (typeof sharedState.value !== 'number') {
            throw new Error("Shared state does not have a numeric 'value'");
        }
        return sharedState;
    }
    _clone() {
        return new CheckPositiveNode();
    }
    async execCore(prepResult) {
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return execResult >= 0 ? 'positive' : 'negative';
    }
}
class NumberNode extends pocket_1.BaseNode {
    constructor(value) {
        super();
        this.value = value;
    }
    _clone() {
        return new NumberNode(this.value);
    }
    async prep(sharedState) {
        sharedState.value = this.value;
        return sharedState;
    }
    async execCore(prepResult) {
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
class NoOpNode extends pocket_1.BaseNode {
    async prep(sharedState) {
        if (typeof sharedState.value !== 'number') {
            throw new Error("Shared state does not have a numeric 'value'");
        }
        return sharedState;
    }
    _clone() {
        return new NoOpNode();
    }
    async execCore(prepResult) {
        return prepResult.value;
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
describe("Math Flow Tests", () => {
    test("Math flow calculates shared state correctly", async () => {
        // initial state with value 10
        const initialSharedState = { value: 10 };
        // Create a chain: 10 + 5 = 15, then 15 * 2 = 30, then 30 - 3 = 27
        const addNode = new AddNode(5);
        const multiplyNode = new MultiplyNode(2);
        const subtractNode = new SubtractNode(3);
        // Chain the nodes (all use default action)
        addNode.addSuccessor(multiplyNode, pocket_1.DEFAULT_ACTION);
        multiplyNode.addSuccessor(subtractNode, pocket_1.DEFAULT_ACTION);
        const mathFlow = new pocket_1.Flow(addNode);
        await mathFlow.run(initialSharedState);
        expect(initialSharedState.value).toBe(27);
    });
    test("Node throws error if shared state is missing required value", async () => {
        const initialSharedState = {}; // 'value' is missing
        const addNode = new AddNode(5);
        await expect(addNode.run(initialSharedState)).rejects.toThrow("Shared state does not have a numeric 'value'");
    });
    test("Branching pipeline with positive number route", async () => {
        const start = new NumberNode(5);
        const check = new CheckPositiveNode();
        const addPositive = new AddNode(10);
        const addNegative = new AddNode(-20);
        // Connect the nodes
        start.addSuccessor(check, pocket_1.DEFAULT_ACTION);
        check.addSuccessor(addPositive, 'positive');
        check.addSuccessor(addNegative, 'negative');
        const flow = new pocket_1.Flow(start);
        const sharedState = { value: 0 };
        await flow.run(sharedState);
        expect(sharedState.value).toBe(15);
    });
    test("Branching pipeline with negative number route", async () => {
        const start = new NumberNode(-5);
        const check = new CheckPositiveNode();
        const addPositive = new AddNode(10);
        const addNegative = new AddNode(-20);
        // Connect the nodes
        start.addSuccessor(check, pocket_1.DEFAULT_ACTION);
        check.addSuccessor(addPositive, 'positive');
        check.addSuccessor(addNegative, 'negative');
        const flow = new pocket_1.Flow(start);
        const sharedState = { value: 0 };
        await flow.run(sharedState);
        expect(sharedState.value).toBe(-25);
    });
    test("Cyclical pipeline that subtracts until negative", async () => {
        const start = new NumberNode(10);
        const check = new CheckPositiveNode();
        const subtract = new SubtractNode(3);
        const noOp = new NoOpNode(); // Changed to use NoOpNode
        // Create cycle: start -> check -> subtract -> check
        start.addSuccessor(check, pocket_1.DEFAULT_ACTION);
        check.addSuccessor(subtract, 'positive'); // if positive, keep subtracting
        check.addSuccessor(noOp, 'negative'); // if negative, perform no-op
        subtract.addSuccessor(check, pocket_1.DEFAULT_ACTION); // after subtraction, check again
        const flow = new pocket_1.Flow(start);
        const sharedState = { value: 0 };
        await flow.run(sharedState);
        // Starting at 10, subtracting 3 repeatedly:
        // 10 -> 7 -> 4 -> 1 -> -2 -> -2 (no-op)
        // Stops at -2 because CheckPositiveNode returns 'negative'
        expect(sharedState.value).toBe(-2);
    });
});
// ===================
// Retry Node Tests
// ===================
// Create a flaky node that intentionally fails a few times then succeeds.
// It extends the built-in RetryNode.
class FlakyRetryNode extends pocket_1.RetryNode {
    constructor(maxRetries, intervalMs, failAttempts) {
        super(maxRetries, intervalMs);
        this.attempt = 0;
        this.failAttempts = failAttempts;
    }
    async prep(sharedState) {
        return sharedState;
    }
    _clone() {
        return new FlakyRetryNode(this.maxRetries, this.intervalMs, this.failAttempts);
    }
    async execCore(prepResult) {
        this.attempt++;
        // Fail for the first 'failAttempts' attempts
        if (this.attempt <= this.failAttempts) {
            throw new Error("Intentional failure");
        }
        return "succeeded";
    }
    async post(prepResult, execResult, sharedState) {
        return pocket_1.DEFAULT_ACTION;
    }
}
describe("Retry Node Tests", () => {
    test("FlakyRetryNode eventually succeeds", async () => {
        // With maxRetries = 3 and failing the first 2 times, it should eventually succeed.
        const flaky = new FlakyRetryNode(3, 10, 2);
        const result = await flaky.run({});
        expect(result).toBe(pocket_1.DEFAULT_ACTION);
    });
    test("FlakyRetryNode fails after exceeding max retries", async () => {
        // With maxRetries = 2 but failing the first 3 times, the node will throw an error.
        const flaky = new FlakyRetryNode(2, 10, 3);
        await expect(flaky.run({})).rejects.toThrow("Max retries reached after 2 attempts");
    });
});
describe("Nested Flow Tests", () => {
    test("Triple nested flows execute correctly", async () => {
        // Create flow f1: NumberNode(5) -> AddNode(10) -> MultiplyNode(2)
        const start = new NumberNode(5);
        const add = new AddNode(10);
        const multiply = new MultiplyNode(2);
        start.addSuccessor(add, pocket_1.DEFAULT_ACTION);
        add.addSuccessor(multiply, pocket_1.DEFAULT_ACTION);
        const f1 = new pocket_1.Flow(start);
        // Create flow f2 that wraps f1
        const f2 = new pocket_1.Flow(f1);
        // Create flow f3 that wraps f2
        const f3 = new pocket_1.Flow(f2);
        const sharedState = { value: 0 };
        await f3.run(sharedState);
        // Final result should be (5 + 10) * 2 = 30
        expect(sharedState.value).toBe(30);
    });
    test("Triple nested flows with different calculation path", async () => {
        // Create inner flow: NumberNode(5) -> AddNode(3)
        const startWithFive = new NumberNode(5);
        const addThree = new AddNode(3);
        const innerFlow = new pocket_1.Flow(startWithFive);
        innerFlow.addSuccessor(addThree, pocket_1.DEFAULT_ACTION);
        // Create middle flow: innerFlow -> MultiplyNode(4)
        const multiplyByFour = new MultiplyNode(4);
        const middleFlow = new pocket_1.Flow(innerFlow);
        middleFlow.addSuccessor(multiplyByFour, pocket_1.DEFAULT_ACTION);
        // Create wrapper flow that contains middleFlow
        const wrapperFlow = new pocket_1.Flow(middleFlow);
        const sharedState = { value: 0 };
        await wrapperFlow.run(sharedState);
        // Final result should be (5 + 3) * 4 = 32
        expect(sharedState.value).toBe(32);
    });
    test("Chaining two flows with wrapper flow", async () => {
        // Create flow1: NumberNode(10) -> AddNode(10)
        const startWithTen = new NumberNode(10);
        const addTen = new AddNode(10);
        startWithTen.addSuccessor(addTen, pocket_1.DEFAULT_ACTION);
        const flow1 = new pocket_1.Flow(startWithTen);
        // Create flow2: MultiplyNode(2)
        const multiplyByTwo = new MultiplyNode(2);
        const flow2 = new pocket_1.Flow(multiplyByTwo);
        // Chain flow1 and flow2 inside wrapper flow
        const wrapperFlow = new pocket_1.Flow(flow1);
        flow1.addSuccessor(flow2, pocket_1.DEFAULT_ACTION);
        const sharedState = { value: 0 };
        await wrapperFlow.run(sharedState);
        // Final result should be (10 + 10) * 2 = 40
        expect(sharedState.value).toBe(40);
    });
});
class TemplateNode extends pocket_1.BaseNode {
    async prep(sharedState) {
        return {};
    }
    async execCore(prepResult) {
        // console.log("Flow params during execution:", this.flow_params);
        const delay = this.flow_params.delay;
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, delay));
        const elapsed = Date.now() - start;
        return `Delay: ${delay}ms, Actual time: ${elapsed}ms`;
    }
    async post(prepResult, execResult, sharedState) {
        // console.log("Post result:", execResult);
        return execResult;
    }
    _clone() {
        return new TemplateNode();
    }
}
class ParameterizedBatchFlow extends pocket_1.BatchFlow {
    async prep(sharedState) {
        // There is no way this would complete in 3 seconds without concurrency
        return [
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
            { delay: 1000 },
            { delay: 2000 },
            { delay: 1500 },
            { delay: 2500 },
            { delay: 800 },
        ];
    }
}
describe("BatchFlow Tests", () => {
    test("BatchFlow spawns parameterized flows and aggregates results", async () => {
        const templateNode = new TemplateNode();
        const batchFlow = new ParameterizedBatchFlow(templateNode);
        const start = Date.now();
        const results = await batchFlow.run({});
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(3000);
    });
});
