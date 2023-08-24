import { CommonRoutesConfig } from "../../common/common.routes.config";
import LoginController from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/login.validation.middleware"
// import { Validator } from "express-json-validator-middleware";
// const { validate } = new Validator({});
import express from 'express';


export class LoginRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    }
    configureRoutes() {

        this.app.route(`/createOTP`)
            .post(
                // validate({ body: LoginSchema.createOTPSchema }),
                LoginValidationMiddleware.checkSchema,
                LoginController.sendOTP
            );
        this.app.route('/validateOTP')
            .post(
                // validate({ body: LoginSchema.validateOTPSchema }),
                LoginValidationMiddleware.checkSchema,
                LoginController.validateOTP
            );
        this.app.route('/registerUser')
            .post(
                // validate({ body: LoginSchema.registerUserSchema }),
                LoginValidationMiddleware.checkSchema,
                LoginMiddleware.checkExistingUser,
                LoginController.createUser
            )
        this.app.route('/loginUser')
            .post(
                LoginValidationMiddleware.checkSchema,
                LoginMiddleware.checkExistingUser,
                LoginController.loginUser
            )
        return this.app;
    }
}