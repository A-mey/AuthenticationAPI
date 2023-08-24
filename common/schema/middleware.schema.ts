import express, {Request, NextFunction} from 'express'

// import { CommonSchema } from "./schema";
import ValidateSchema from './validate.schema'
import { errorMessageObject } from '../types/errorMsgObject.types';

import { Response } from "../../common/types/response.types";
import { ValidateFunction } from 'ajv';


export abstract class ValidationMiddleware{
    
    checkSchema = async(req: Request, res: express.Response, next: NextFunction) => {
        const origin = req.originalUrl.replace("/", "")
        const schema: ValidateFunction<unknown> = await this.getSchema(origin)
        const errorRes: errorMessageObject =  await ValidateSchema.validateSchema(req.body, schema);
        if (errorRes.isValid) {
            next();
          } else {
            const response: Response = {success: false, code: 400, data: {message: errorRes.errorMsg}}
            res.status(400).json(response);
        }
    }

    abstract getSchema (origin: string): ValidateFunction<unknown>;
        // console.log(key)
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
         

    
}