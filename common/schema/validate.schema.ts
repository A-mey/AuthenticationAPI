import { errorMessageObject } from "../types/errorMsgObject.types";
import getErrorServices from "./error.schema";
import { ErrorObject, ValidateFunction } from "ajv";
import express from "express";

class ValidateSchema {
    validateSchema = (async(req: express.Request, schema: ValidateFunction<unknown>) => {
        const error: errorMessageObject = {isValid: false, errorMsg: ""};
        const isValid = schema(req);
        if (isValid) {
            // console.log('Data is valid');
            error.isValid = true
        }
        else {
            error.isValid = false;
            const errors: ErrorObject[] | null | undefined = schema.errors;
            error.errorMsg = getErrorServices.getError(errors![0]) 
        }
        return error;
    })
}

export default new ValidateSchema()