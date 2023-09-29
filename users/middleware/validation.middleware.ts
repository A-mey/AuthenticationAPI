import express, { NextFunction, Request } from "express";
import LoginSchema from "../schema/login.schema";
// import validateSchemaServices from "../../common/services/validateSchema.services";
import ValidateSchema from "../../common/services/schema/validate.schema"
import compileSchema from "../../common/services/schema/compile.schema";
import { CommonSchemaValidator } from "../../common/interfaces/schemaValidation.interface";
import { response } from '../../common/types/response.types';
import { errorMessageObject } from '../../common/types/errorMsgObject.types';

class LoginValidationMiddleware implements CommonSchemaValidator{
    
    checkSchema = async (req: Request, res: express.Response, next: NextFunction) => {
        const origin: (keyof typeof LoginSchema.schema) = req.originalUrl.replace("/", "") as (keyof typeof LoginSchema.schema);
        const schema = LoginSchema.schema[origin];
        const validateSchemaFn = await compileSchema.compile(schema)
        const errorRes: errorMessageObject =  await ValidateSchema.validateSchema(req.body, validateSchemaFn);
        if (errorRes.isValid) {
            next();
          } else {
            const response: response = {success: false, code: 400, data: {message: errorRes.errorMsg}}
            res.status(400).json(response);
        }
    }
}

export default new LoginValidationMiddleware()