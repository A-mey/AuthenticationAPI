// import { errorMessageObject } from "../types/errorMsgObject.types";
// import getErrorServices from "../schema/error.schema";
// import { ErrorObject } from "ajv";
// import express from "express";

// class ValidateSchema {
//     validateSchema = (async(req: express.Request, schema: any) => {
//         let error: errorMessageObject = {isValid: false, errorMsg: ""};
//         var isValid = schema(req);
//         if (isValid) {
//             // console.log('Data is valid');
//             error.isValid = true
//         }
//         else {
//             error.isValid = false;
//             let errors: ErrorObject[] | null | undefined = schema.errors;
//             error.errorMsg = getErrorServices.getError(errors![0]) 
//         }
//         return error;
//     })
// }

// export default new ValidateSchema()