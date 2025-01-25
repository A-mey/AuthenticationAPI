import {get} from "express-http-context";

export class LogService {
    private className: string;
    private function: string = "";

    constructor(className: string) {
        this.className = className;
    }

    log = (variableName: string, variableValue?: unknown): void => {
        const requestId = get("requestId");
        console.log(requestId, `${this.className}:${this.function}::${variableName}`, JSON.parse(JSON.stringify(variableValue || "")));
    }

    addFunctionName = (functionName: string): void => {
        this.function = functionName;
    }


}