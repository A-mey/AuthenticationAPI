import { NextFunction, Request, Response } from 'express';
// import debug from 'debug';
import { LoginService } from '../services/login.service';
import { encryptionData } from '../types/encryptionData.type';
import { validateUserDTO } from '../dto/validate.user.dto';
import { catchError } from '../../common/utils/catch.util';
import responseTemplates from '../../common/constants/response.template.constants';
import { LogService } from '../../common/services/logger/log.service';
// const log: debug.IDebugger = debug('app:users-controller');
class LoginMiddleware {
    logger: LogService;

    constructor(private loginService: LoginService) { 
        this.logger = new LogService("LoginMiddleware");
    }

    checkWhetherUserExists = async (req: Request, res: Response, next: NextFunction) => {
        const logger = this.logger;
        logger.addFunctionName("checkWhetherUserExists");
        try {
            const emailId = req.body.EMAILID;
            logger.log("emailId", emailId);
            const doestheUserExist = await this.loginService.checkWhetherUserExists(emailId);
            if (doestheUserExist) {
                next()
            } else {
                const response = responseTemplates.USER_NOT_FOUND;
                res.status(response.code).json(response);
            }
        } catch (error: unknown) {
            const response = responseTemplates.DEFAULT_ERROR;
            res.status(response.code).json(responseTemplates.DEFAULT_ERROR);
        }        
    }

    checkWhetherUserIsNew = async (req: Request, res: Response, next: NextFunction) => {
        const logger = this.logger;
        logger.addFunctionName("checkWhetherUserIsNew");
        try {
            const emailId = req.body.EMAILID;
            logger.log("emailId", emailId);
            const doesTheUserExist = await this.loginService.checkWhetherUserExists(emailId);
            if (!doesTheUserExist) {
                next();
            } else {
                const response = responseTemplates.ALREADY_EXISTS;
                res.status(response.code).json(response);
            }
        } catch (error: unknown) {
            console.log(await catchError(error));
            const response = responseTemplates.DEFAULT_ERROR;
            res.status(response.code).json(response);
        }
    }

    authenticateLoginData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const emailId = req.body.EMAILID;
            const password = req.body.PASSWORD;
            const encryptionData: encryptionData = await this.loginService.createUserAuth(emailId, password);
            const usernameHash = encryptionData.usernameHash;
            const providedUserAuth = encryptionData.userAuth;
            const userAuthCheck: validateUserDTO = {USERNAMEHASH: usernameHash, USERAUTH: providedUserAuth}
            const checkAuthResponse = await this.loginService.authenticateUserData(userAuthCheck);
            if (checkAuthResponse?.code === 200) {
                const pillObject: {AUTHPILL: string} = checkAuthResponse.data.data as unknown as {AUTHPILL: string};
                encryptionData.authPill =  pillObject.AUTHPILL;
                res.locals.encryptionData = encryptionData;
                res.locals.loginRequest = {emailId: emailId, password: password};
                next();
            } else {
                res.status(401).json(responseTemplates.INVALID_CREDENTIALS);
            }
        } catch (error: unknown) {
            console.log(await catchError(error));
            const response = responseTemplates.DEFAULT_ERROR;
            res.status(response.code).json(response);
        }        
    }

    validatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const encryptionData: encryptionData = res.locals.encryptionData;
            const password: string = res.locals.loginRequest.password;
            const oldPassword = await this.loginService.getOldPassword(encryptionData);
            if (oldPassword === password) {
                res.locals.emailId = res.locals.loginRequest.emailId;
                next();
            } else {
                const responseData = responseTemplates.INVALID_CREDENTIALS;
                res.status(responseData.code).json(responseData);
            }
        } catch (error: unknown) {
            console.log(await catchError(error));
            const responseData = responseTemplates.DEFAULT_ERROR;
            res.status(responseData.code).json(responseData);
        }
    }
}

export default new LoginMiddleware(new LoginService());