import 'reflect-metadata';
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { LoginController } from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/validation.middleware"
import express from 'express';


export class LoginRoutes {
    app: express.Application;
    private loginController!: LoginController;

    constructor(app: express.Application, loginController: LoginController) {
        // super(app, 'UserRoutes');
        this.app = app;
        this.loginController = loginController;
    }
    configureRoutes() {

        this.app.use(LoginValidationMiddleware.checkSchema);

        this.app.route(`/createOTP`)
            .post(
                LoginMiddleware.checkWhetherUserExists,
                this.loginController.sendOTP
            );
        this.app.route('/validateOTP')
            .post(
                this.loginController.validateOTP
            );
        this.app.route('/registerUser')
            .post(
                this.loginController.createUser
            )
        this.app.route('/loginUser')
            .post(
                LoginMiddleware.checkWhetherUserExists,
                LoginMiddleware.authenticateLoginData,
                LoginMiddleware.validatePassword,
                this.loginController.returnUserData
            )
        return this.app;
    }
}