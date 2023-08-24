import { ErrorObject } from "ajv";

class SchemaError {
    constructor() {}

    getError(error: ErrorObject) {
        let err: string = "";
        try {
            switch(error.keyword) {
                case 'additionalProperties':
                    err = `Unable to find property ${error.params.additionalProperty}`
                    break;
                case 'required':
                    err =  `Missing property ${error.params.missingProperty}`
                    break;
                case 'type':
                case 'format':
                case 'enum':
                    err = `Invalid type for property ${error.instancePath}`
                    break;
                default:
                    err = "Unknown error"
    
            }
        }
        catch(e) {
            console.log(e);
            err = "Unknown error"
        }
        return err;
    }
}

export default new SchemaError()