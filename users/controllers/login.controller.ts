import express from 'express';

import { LoginService } from '../services/login.service';

import { CreateUserDTO } from '../dto/create.user.dto';
import { OtpObject } from '../../common/types/otpObject.types';
import { response } from '../../common/types/response.types';
import { getUserDTO } from '../dto/get.user.dto';
import { createUserInput } from '../types/create.user.input.type';
import { catchError } from '../../common/utils/catch.util';
import responseTemplates from '../../common/constants/response.template.constants';
import { LogService } from '../../common/services/logger/log.service'
import logFactoryService from '../../common/services/logger/log.factory.service';
// const log: debug.IDebugger = debug('app:users-controller');

class LoginController {
    logger: LogService;

    constructor(private loginService: LoginService) {
        this.logger = new LogService("LoginController");
    }

    sendOTP = async (req: express.Request, res: express.Response) => {
        const logger = await logFactoryService.getLog(this.logger, "sendOTP");
        try{
            const emailId = req.body.EMAILID;
            const otpObject: OtpObject = await this.loginService.getOtpObject(emailId);
            logger.log("otpObject", otpObject);
            const otp = otpObject.otp;
            await this.loginService.sendOtpViaMail(emailId, otp);
            const response: response = responseTemplates.OTP_SENT;
            res.status(response.code).json(response);
        } catch (error: unknown) {
            logger.log("error", await catchError(error));
            res.status(500).json(responseTemplates.DEFAULT_ERROR);
        }
        
    }

    validateOTP = async (req: express.Request, res: express.Response) => {
        const logger = await logFactoryService.getLog(this.logger, "validateOTP");
        let responseData: response = responseTemplates.DEFAULT_ERROR;
        try {
            const isOtpValid = await this.loginService.checkWhetherOtpIsValid(req.body.EMAILID, req.body.HASH, req.body.OTP)
            responseData = isOtpValid === true ? responseTemplates.OTP_MATCHED_SUCCESS : responseTemplates.OTP_MATCHED_FAILURE;
            res.status(responseData.code).json(responseData);
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
        }
        res.status(responseData.code).json(responseData);
    }

    createUser = async (req: express.Request, res: express.Response) => {
        const logger = await logFactoryService.getLog(this.logger, "createUser");
        let responseData: response = responseTemplates.DEFAULT_ERROR;
        try {
            const userData: createUserInput = req.body;
            const createUserData: CreateUserDTO = await this.loginService.createUserData(userData);
            logger.log("createUserData", createUserData);
            const storeUserDataResponse = await this.loginService.createNewUser(createUserData);
            logger.log("storeUserDataResponse", storeUserDataResponse);
            responseData = storeUserDataResponse;
        } catch (error: unknown) {
            console.log(await catchError(error));
        }
        res.status(responseData.code).json(responseData);
    }

    returnUserData = async (req: express.Request, res: express.Response) => {
        const logger = await logFactoryService.getLog(this.logger, "createUser");
        let responseData: response = responseTemplates.DEFAULT_ERROR;
        try {
            const emailId = res.locals.loginRequest.emailId;
            logger.log("emailId", emailId);
            const emailObject: getUserDTO = {EMAILID: emailId};
            const userDataResponse = await this.loginService.getUserDetails(emailObject);
            logger.log("userDataResponseuserDataResponse", emailId);
            responseData = userDataResponse;
        } catch (error: unknown) {
            logger.log("error", await catchError(error));
        }
        res.status(responseData.code).json(responseData);        
    }
}

export default new LoginController(new LoginService());