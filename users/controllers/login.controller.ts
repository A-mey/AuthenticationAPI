import express from 'express';

import loginService from '../services/login.service';
import loginDao from '../dao/login.http.service';


import otpService from '../../common/services/otp.services';
import { CreateUserDTO } from '../dto/create.user.dto';
// import { catchError } from '../../common/utils/catch.util';
import { OtpObject } from '../../common/types/otpObject.types';
import { response } from '../../common/types/response.types';
// import { Pill } from '../types/pill.type';
// import { encryptionData } from '../types/encryptionData.type';
// import { validateUserDTO } from '../dto/validate.user.dto';
import { getUserDTO } from '../dto/get.user.dto';
import { defaultResponse } from '../../common/helpers/defaultResponse.helper';
import { createUserInput } from '../types/create.user.input.type';
import { catchError } from '../../common/utils/catch.util';
// const log: debug.IDebugger = debug('app:users-controller');
class UsersController {

    sendOTP = async (req: express.Request, res: express.Response) => {
        const emailId = req.body.EMAILID;
        const otpObject: OtpObject = await otpService.createOTPObject(emailId);
        await otpService.sendOtpMail(emailId, otpObject.otp!);
        const status = 200;
        const response: response = {success: true, code: status, data: {message: "OTP sent successfully", data: {fullHash: otpObject.fullHash}}};
        res.status(status).json(response);
    }

    validateOTP = async (req: express.Request, res: express.Response) => {
        const responseData: response = defaultResponse;
        const isOtpValid = await loginService.checkWhetherOtpIsValid(req.body.EMAILID, req.body.HASH, req.body.OTP)
        if (isOtpValid === true) {
            responseData.code = 200;
            responseData.success = true;
            responseData.data.message = "OTP matched";
        }
        else if (isOtpValid === false) {
            responseData.code = 401;
            responseData.data.message = "OTP did not match";
        }
        console.log("isOtpValid", isOtpValid);
        console.log("responseData", responseData);
        res.status(responseData.code).json(responseData);
    }

    createUser = async (req: express.Request, res: express.Response) => {
        let response = defaultResponse;
        try {
            const userData: createUserInput = req.body;
            const createUserData: CreateUserDTO = await loginService.createUserData(userData);
            const storeUserDataResponse = await loginDao.storeUserData(createUserData);
            console.log("UsersController:createUser", storeUserDataResponse);
            response = storeUserDataResponse;
        } catch (error: unknown) {
            console.log(await catchError(error));
        }
        res.status(response.code).json(response);
    }

    returnUserData = async (req: express.Request, res: express.Response) => {
        // res.status(userDataResponse.code).json(userDataResponse);
        let response = defaultResponse;
        try {
            const emailId = res.locals.loginRequest.emailId;
            const emailObject: getUserDTO = {EMAILID: emailId};
            const userDataResponse = await loginDao.getUserDetails(emailObject);
            response = userDataResponse;
        } catch (error: unknown) {
            console.log(await catchError(error));
        }
        res.status(response.code).json(response);        
    }
}

export default new UsersController();