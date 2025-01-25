import { CommonRoutesConfig } from "../../common/common.routes.config";
import { LoginController } from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import { BodyValidationMiddleware } from "../../common/middleware/body.validation.middleware";
import idMiddleware from "../../common/middleware/id.middleware";
import express from 'express';
import { LoginService } from "../services/login.service";
import LoginSchema from "../schema/login.schema"


export class LoginRoutes implements CommonRoutesConfig {
    
    private bodyValidationMiddleware: BodyValidationMiddleware;
    app: express.Application;
    private name = "LoginRoutes";
    loginController: LoginController;
    loginService: LoginService;
    
    constructor(app: express.Application) {
        this.app = app;
        this.bodyValidationMiddleware = new BodyValidationMiddleware(LoginSchema);
        this.loginService = new LoginService();
        this.loginController = new LoginController(this.loginService);
    }

    configureRoutes() {

        this.app.use(idMiddleware.createRequestId);

        this.app.use(this.bodyValidationMiddleware.checkSchema);

        this.app.route(`/createOTP`)
            .post(
                LoginMiddleware.checkWhetherUserDoesNotAlreadyExist,
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

    getName(): string {
        return this.name;
    }
}