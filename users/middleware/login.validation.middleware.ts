import express, { NextFunction, Request } from "express";
import { errorMessageObject } from "../../common/types/errorMsgObject.types";
import { Response } from "../../common/types/response.types";
import LoginSchema from "../schema/login.schema";
// import validateSchemaServices from "../../common/services/validateSchema.services";
import ValidateSchema from "../../common/schema/validate.schema"
import compileSchema from "../../common/schema/compile.schema";

class LoginValidationMiddleware {
    
    checkSchema = async (req: Request, res: express.Response, next: NextFunction) => {
        const origin: (keyof typeof LoginSchema.schema) = req.originalUrl.replace("/", "") as (keyof typeof LoginSchema.schema);
        const schema = await this.getSchema(origin);
        const errorRes: errorMessageObject =  await ValidateSchema.validateSchema(req.body, schema);
        if (errorRes.isValid) {
            next();
          } else {
            const response: Response = {success: false, code: 400, data: {message: errorRes.errorMsg}}
            res.status(400).json(response);
        }
    }

    getSchema = async (key: (keyof typeof LoginSchema.schema)) => {
        console.log(key)
        // switch(key) {
        //     case "/createOTP":
        //         schema = LoginSchema.createOTPSchemaValidate;
        //         break;
        //     case "/validateOTP":
        //         schema = LoginSchema.validateOTPSchemaValidate;
        //         break;
        //     case "/registerUser":
        //         schema = LoginSchema.registerUserSchemaValidate;
        //         break;
        //     case "/loginUser":
        //         schema = LoginSchema.loginUserSchemaValidate;
        //         break;
        //         // return this.error;
        // }
        // let schema: Object = LoginSchema.loginSchema;
        // const getKeyValue = <T extends object, U extends keyof T>(key: U) => (obj: T) => obj[key];
        // let schemaValidate = <T extends object, U extends keyof T>(key: U) => (schema: T) => schema[key];
        const temp = LoginSchema.schema;
        // const schema = <T extends object, U extends keyof T>(key: U) => (temp: T) => temp[key];
        // const schema = LoginSchema.loginSchema[key as keyof Object];
        
        const schema = temp[key];
        const validateSchema = compileSchema.compile(schema);

        return validateSchema;  

    }
}

export default new LoginValidationMiddleware()