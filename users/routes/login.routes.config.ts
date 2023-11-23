import 'reflect-metadata';
// import { CommonRoutesConfig } from "../../common/common.routes.config";
import LoginController from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/validation.middleware"
import express from 'express';


export class LoginRoutes {
    app: express.Application;
    
    constructor(app: express.Application) {
        // super(app, 'UserRoutes');
        this.app = app;
    }
    configureRoutes() {

        this.app.use(LoginValidationMiddleware.checkSchema);

        this.app.route(`/createOTP`)
            .post(
                LoginMiddleware.checkWhetherUserExists,
                LoginController.sendOTP
            );
        this.app.route('/validateOTP')
            .post(
                LoginController.validateOTP
            );
        this.app.route('/registerUser')
            .post(
                LoginController.createUser
            )
        this.app.route('/loginUser')
            .post(
                LoginMiddleware.checkWhetherUserExists,
                LoginMiddleware.authenticateLoginData,
                LoginMiddleware.validatePassword,
                LoginController.returnUserData
            )
        return this.app;
    }
}