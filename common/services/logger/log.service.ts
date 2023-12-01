import {get} from "express-http-context";

export class LogService {
    private tag: string;

    constructor(tag: string) {
        this.tag = tag;
    }

    log = (variableName: string, variableValue?: unknown): void => {
        const requestId = get("requestId");
        console.log(requestId, `${this.tag}::${variableName}`, JSON.parse(JSON.stringify(variableValue || "")));
    }

    addFunctionName = (functionName: string): void => {
        this.tag = this.tag + ":" + functionName;
    }


}