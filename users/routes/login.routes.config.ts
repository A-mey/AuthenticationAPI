import { CommonRoutesConfig } from "../../common/common.routes.config";
import { LoginController } from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/validation.middleware"
import express from 'express';


export class LoginRoutes extends CommonRoutesConfig {

    private loginController: LoginController;

    constructor(app: express.Application) {
        super(app, 'UserRoutes');
        this.loginController = new LoginController();
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