import { BaseNode, DEFAULT_ACTION } from "../pocket-local";

interface LocalAdditionNodeState {
    num1: number;
    num2: number;
}

interface LocalAdditionExecResult {
    sum: number;
}

export class LocalAdditionNode extends BaseNode {
    async prep(sharedState: LocalAdditionNodeState): Promise<LocalAdditionNodeState> {
        console.log("[LocalAdditionNode Prep]");
        if (typeof sharedState.num1 !== 'number' || typeof sharedState.num2 !== 'number') {
            throw new Error("Input state requires num1 and num2 to be numbers.");
        }
        return sharedState;
    }

    async execCore(prepResult: LocalAdditionNodeState): Promise<LocalAdditionExecResult> {
        console.log("[LocalAdditionNode ExecCore]");
        const sum = prepResult.num1 + prepResult.num2;
        console.log(`[LocalAdditionNode] Calculated sum: ${sum}`);
        return { sum };
    }

    async post(prepResult: LocalAdditionNodeState, execResult: LocalAdditionExecResult, sharedState: any): Promise<string> {
        console.log("[LocalAdditionNode Post]");
        sharedState.result = execResult.sum;
        sharedState.lastNode = 'LocalAdditionNode';
        console.log(`[LocalAdditionNode] Stored result: ${sharedState.result}`);
        return DEFAULT_ACTION;
    }

    _clone(): BaseNode {
        return new LocalAdditionNode();
    }
}
