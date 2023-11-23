import { NextFunction, Request, Response } from 'express';
// import debug from 'debug';
import loginDao from '../dao/login.dao';
import { response } from '../../common/types/response.types';
import loginService from '../services/login.service';
import { encryptionData } from '../types/encryptionData.type';
import { validateUserDTO } from '../dto/validate.user.dto';
import { catchError } from '../../common/utils/catch.util';
import { defaultResponse } from '../../common/helpers/defaultResponse.helper';

// const log: debug.IDebugger = debug('app:users-controller');
class LoginMiddleware {
    checkWhetherUserExists = async (req: Request, res: Response, next: NextFunction) => {
        const returnData: response = {success: false, code: 400, data: {message: "something went wrong"} };
        const emailId = req.body.EMAILID;
        let proceedFurther: boolean = false;
        if (req.originalUrl == '/loginUser') {
            proceedFurther = await loginService.checkWhetherUserExists(emailId);
            returnData.code = 404;
            returnData.data.message = "No such user found";
        } else if (req.originalUrl == '/createOTP') {
            proceedFurther = await loginService.checkToEnsureUserIsNotRepeated(emailId);
            returnData.code = 409;
            returnData.data.message = "This email Id already exists";
        }
        if (proceedFurther) {
            next()
        } else {
            res.status(returnData.code).json(returnData);
        }
    }

    authenticateLoginData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const emailId = req.body.EMAILID;
            const password = req.body.PASSWORD;
            const encryptionData: encryptionData = await loginService.createUserAuth(emailId, password);
            const usernameHash = encryptionData.usernameHash;
            const providedUserAuth = encryptionData.userAuth;
            const userAuthCheck: validateUserDTO = {USERNAMEHASH: usernameHash, USERAUTH: providedUserAuth}
            const checkAuthResponse = await loginDao.checkAuth(userAuthCheck);
            if (checkAuthResponse?.code === 200) {
                const pillObject: {AUTHPILL: string} = checkAuthResponse.data.data as unknown as {AUTHPILL: string};
                encryptionData.authPill =  pillObject.AUTHPILL;
                res.locals.encryptionData = encryptionData;
                res.locals.loginRequest = {emailId: emailId, password: password};
                next(encryptionData);
            } else {
                res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
            }
        } catch (error: unknown) {
            console.log(await catchError(error));
            const response = defaultResponse;
            res.status(response.code).json(response);
        }        
    }

    validatePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const encryptionData: encryptionData = res.locals.encryptionData;
            const password: string = res.locals.loginRequest.password;
            const oldPassword = await loginService.getOldPassword(encryptionData);
            if (oldPassword === password) {
                res.locals.emailId = res.locals.loginRequest.emailId;
                next();
            } else {
                res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
            }
        } catch (error: unknown) {
            console.log(await catchError(error));
            const response = defaultResponse;
            res.status(response.code).json(response);
        }
    }
}

export default new LoginMiddleware();