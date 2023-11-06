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
        if (isOtpValid == true) {
            responseData.code = 204;
            responseData.success = true;
            responseData.data.message = "OTP matched";
        }
        else if (isOtpValid == false) {
            responseData.code = 401;
            responseData.data.message = "OTP did not match";
        }
        res.status(responseData.code).json(responseData);
    }

    createUser = async (req: express.Request, res: express.Response) => {
        const userData: createUserInput = req.body;
        const createUserData: CreateUserDTO = await loginService.createUserData(userData);
        const storeUserDataResponse = await loginDao.storeUserData(createUserData);
        console.log("UsersController:createUser", storeUserDataResponse);
        res.status(storeUserDataResponse.code).json({storeUserDataResponse});
    }

    // loginUser = async (req: express.Request, res: express.Response) => {
    //     const emailId = req.body.EMAILID;
    //     const password = req.body.PASSWORD;
    //     const encryptionData: encryptionData = await loginService.createUserAuth(emailId, password);
    //     const usernameHash = encryptionData.usernameHash;
    //     const providedUserAuth = encryptionData.userAuth;
    //     const userAuthCheck: validateUserDTO = {USERNAMEHASH: usernameHash, USERAUTH: providedUserAuth}
    //     const authPillData = await loginDao.checkAuth(userAuthCheck);

    //     if (authPillData?.code !== 200) {
    //         return res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
    //     }
    //     const pillObject: {AUTHPILL: string} = authPillData?.data?.data as unknown as {AUTHPILL: string};
    //     const authPill = pillObject?.AUTHPILL;
    //     const pill = authPill.substring(providedUserAuth.length, authPill.length);
    //     const oldPassword = await loginService.decryptAuthPill(pill, password, encryptionData.key, encryptionData.customSalt);
    //     if (password === oldPassword) {
    //         const emailObject: getUserDTO = {EMAILID: emailId};
    //         const userData = await loginDao.getUserDetails(emailObject);
    //         if (userData){
    //             res.status(200).json({success: true, code: 200, data: {message: "Logged in successfully", data: userData.data!.data!}});
    //         }
    //         else {
    //             res.status(400).json({success: false, code: 401, data: {message: "Something went wrong"}});
    //         }
    //     }
    //     else {
    //         res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
    //     }
    // }

    returnUserData = async (req: express.Request, res: express.Response) => {
        const emailId = res.locals.loginRequest.emailId;
        const emailObject: getUserDTO = {EMAILID: emailId};
        const userDataResponse = await loginDao.getUserByEmailId(emailObject);
        res.status(userDataResponse.code).json(userDataResponse);
    }
}

export default new UsersController();