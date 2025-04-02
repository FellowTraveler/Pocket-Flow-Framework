// Simplified version of the Pocket Flow Framework for the example
export const DEFAULT_ACTION = "default";

export abstract class BaseNode {
    public flow_params: any;
    public successors: Map<string, BaseNode>;

    constructor() {
        this.flow_params = {};
        this.successors = new Map();
    }

    public setParams(params: any): void {
        this.flow_params = params;
    }

    public clone(): BaseNode {
        const newNode = this._clone();
        newNode.flow_params = JSON.parse(JSON.stringify(this.flow_params));
        newNode.successors = new Map(this.successors);
        return newNode;
    }

    abstract _clone(): BaseNode;

    public addSuccessor(newSuccessor: BaseNode, action: string = DEFAULT_ACTION): void {
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
    
    abstract prep(sharedState: any): Promise<any>;
    abstract execCore(prepResult: any): Promise<any>;
    abstract post(prepResult: any, execResult: any, sharedState: any): Promise<string>;

    public async run(sharedState: any): Promise<string> {
        const prepResult = await this.prep(sharedState);
        const execResult = await this.execCore(prepResult);
        const action = await this.post(prepResult, execResult, sharedState);
        return action;
    }
}

export class Flow extends BaseNode {
    private start: BaseNode;

    constructor(start: BaseNode) {
        super();
        this.start = start;
    }

    public _clone(): BaseNode {
        return new Flow(this.start);
    }

    async getStartNode(): Promise<BaseNode> {
        return this.start.clone();
    }

    async execCore(prepResult: any): Promise<any> {
        throw new Error("Flow node does not support direct execution");
    }

    async prep(sharedState: any): Promise<any> {
        return {}; // Pass through the shared state to exec_core
    }

    async orchestrate(sharedState: any, flowParams?: any): Promise<any> {
        let currentNode: BaseNode | undefined = await this.getStartNode();
        while (currentNode) {
            console.log("Orchestrate -- currentNode", currentNode);
            currentNode.setParams((flowParams) ? flowParams : this.flow_params);
            const action = await currentNode.run(sharedState);
            currentNode = currentNode.getSuccessor(action); // If undefined, the flow is complete
        }
    }

    async run(sharedState: any): Promise<string> {
        const prepResult = await this.prep(sharedState);
        await this.orchestrate(sharedState);
        return this.post(prepResult, undefined, sharedState);
    }

    async post(prepResult: any, execResult: any, sharedState: any): Promise<string> {
        return DEFAULT_ACTION;
    }
}
