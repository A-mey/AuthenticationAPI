import getErrorServices from "./error.schema";
import { ErrorObject, ValidateFunction } from "ajv";

class ValidateSchema {
    validateSchema = (async(obj: object, schema: ValidateFunction<unknown>) => {
        const error: errorMessageObject = {isValid: false, errorMsg: ""};
        const isValid = schema(obj);
        if (isValid) {
            // console.log('Data is valid');
            error.isValid = true
        }
        else {
            error.isValid = false;
            const errors: ErrorObject[] | null | undefined = schema.errors;
            error.errorMsg = await getErrorServices.getError(errors![0]) 
        }
        return error;
    })
}

export default new ValidateSchema()