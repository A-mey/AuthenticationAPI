import { CommonRoutesConfig } from "../../common/common.routes.config";
import LoginController from '../controllers/login.controller';
import LoginMiddleware from '../middleware/login.middleware';
import LoginValidationMiddleware from "../middleware/validation.middleware";
import idMiddleware from "../middleware/id.middleware";
import express from 'express';


export class LoginRoutes extends CommonRoutesConfig {
    
    constructor(app: express.Application) {
        super(app, 'UserRoutes');
    }
    configureRoutes() {

        this.app.use(idMiddleware.createRequestId);

        this.app.use(LoginValidationMiddleware.checkSchema);

        this.app.route(`/createOTP`)
            .post(
                LoginMiddleware.checkWhetherUserDoesNotAlreadyExist,
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