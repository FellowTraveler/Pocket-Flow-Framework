import { BaseNode, DEFAULT_ACTION } from "pocket"; // Adjust the import path as needed

interface {{NodeName}}State {
  // Define expected input properties in sharedState
  inputData?: string;
}

interface {{NodeName}}PrepResult {
  // Define data structure returned by prep
  preparedInput: string;
}

interface {{NodeName}}ExecResult {
  // Define data structure returned by execCore
  processedData: string;
}

export class {{NodeName}} extends BaseNode {
  async prep(sharedState: {{NodeName}}State): Promise<{{NodeName}}PrepResult> {
    console.log(`{{NodeName}} Prep: Processing input - ${sharedState.inputData}`);
    // Validate input, prepare data for execCore
    const preparedInput = sharedState.inputData?.toUpperCase() || "DEFAULT_INPUT";
    return { preparedInput };
  }

  async execCore(prepResult: {{NodeName}}PrepResult): Promise<{{NodeName}}ExecResult> {
    console.log(`{{NodeName}} ExecCore: Executing with - ${prepResult.preparedInput}`);
    // Perform the core logic of the node
    const processedData = `Processed: ${prepResult.preparedInput}`;
    return { processedData };
  }

  async post(prepResult: {{NodeName}}PrepResult, execResult: {{NodeName}}ExecResult, sharedState: any): Promise<string> {
    console.log(`{{NodeName}} Post: Storing result - ${execResult.processedData}`);
    // Update shared state, decide next action
    sharedState.{{nodeName}}Result = execResult.processedData;
	// sharedState.lastNode = '{{NodeName}}'; // Example state update

    // Determine the next action based on results or state
    // if (execResult.processedData.includes("ERROR")) {
    //   return "errorAction";
    // }
    return DEFAULT_ACTION;
  }

  _clone(): BaseNode {
    return new {{NodeName}}();
  }
}
