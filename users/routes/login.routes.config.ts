import { CommonRoutesConfig } from "../../common/common.routes.config";
import LoginController from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/validation.middleware"
import express from 'express';


export class LoginRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    }
    configureRoutes() {

        this.app.route(`/createOTP`)
            .post(
                LoginValidationMiddleware.checkSchema,
                LoginMiddleware.checkExistingUser,
                LoginController.sendOTP
            );
        this.app.route('/validateOTP')
            .post(
                LoginValidationMiddleware.checkSchema,
                LoginController.validateOTP
            );
        this.app.route('/registerUser')
            .post(
                LoginValidationMiddleware.checkSchema,
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