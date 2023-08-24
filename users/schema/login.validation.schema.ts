// import LoginSchema from "./login.schema";
// // import { CommonSchemaValidator } from "../../common/interfaces/schemaValidation.interface"; 
// import { ErrorObject } from "ajv";
// import { errorMessageObject } from "../../common/types/errorMsgObject.types";
// import getErrorServices from "../../common/services/getError.services";

// // class LoginValidationSchema extends LoginSchema implements CommonSchemaValidator {
// //     constructor() {
// //         super()
// //     }

// //     public error: errorMessageObject = {isValid: false, errorMsg: ""};

// //     validateRequest(req: any, key: string) {
// //         switch(key) {
// //             case "createOTP":
// //                 var isValid = this.createOTPSchemaValidate(req);
// //                 if (isValid) {
// //                     // console.log('Data is valid');
// //                     this.error.isValid = true
// //                     return this.error;
// //                 }
// //                 else {
// //                     this.error.isValid = false;
// //                     let errors: ErrorObject[] | null | undefined = this.createOTPSchemaValidate.errors;
// //                     this.error.errorMsg = getErrorServices.getError(errors![0]) 
// //                     return this.error;
// //                 }

// //             case "validateOTP":
// //                 var isValid = this.validateOTPSchemaValidate(req);
// //                 if (isValid) {
// //                     // console.log('Data is valid');
// //                     this.error.isValid = true
// //                     return this.error;
// //                 }
// //                 else {
// //                     this.error.isValid = false;
// //                     let errors: ErrorObject[] | null | undefined = this.validateOTPSchemaValidate.errors;
// //                     this.error.errorMsg = getErrorServices.getError(errors![0]) 
// //                     return this.error;
// //                 }
// //             case "registerUser":
// //                 var isValid = this.registerUserSchemaValidate(req);
// //                 if (isValid) {
// //                     // console.log('Data is valid');
// //                     this.error.isValid = true
// //                     return this.error;
// //                 }
// //                 else {
// //                     this.error.isValid = false;
// //                     let errors: ErrorObject[] | null | undefined = this.registerUserSchemaValidate.errors;
// //                     this.error.errorMsg = getErrorServices.getError(errors![0]) 
// //                     return this.error;
// //                 }
// //             case "loginUser":
// //                 var isValid = this.loginUserSchemaValidate(req);
// //                 if (isValid) {
// //                     // console.log('Data is valid');
// //                     this.error.isValid = true
// //                     return this.error;
// //                 }
// //                 else {
// //                     this.error.isValid = false;
// //                     let errors: ErrorObject[] | null | undefined = this.loginUserSchemaValidate.errors;
// //                     this.error.errorMsg = getErrorServices.getError(errors![0]) 
// //                     return this.error;
// //                 }
// //             default:
// //                 return this.error;
// //         }
// //     }
// // }

// // export default new LoginValidationSchema()

// class LoginValidationSchema {
//     async validateSchema(req: any, schema: any) {
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
//     }

//     async getSchema(key: string) {
//         console.log(key)
//         let schema;
//         switch(key) {
//             case "/createOTP":
//                 schema = LoginSchema.createOTPSchemaValidate;
//                 break;
//             case "/validateOTP":
//                 schema = LoginSchema.validateOTPSchemaValidate;
//                 break;
//             case "/registerUser":
//                 schema = LoginSchema.registerUserSchemaValidate;
//                 break;
//             case "/loginUser":
//                 schema = LoginSchema.loginUserSchemaValidate;
//                 break;
//         }
//         return schema;
//     }
// }

// // export default new LoginValidationSchema()