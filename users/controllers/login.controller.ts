import express from 'express';

// we import our newly created user services
import loginService from '../services/login.service';
import loginHttpService from '../services/login.http.service';

// we use debug with a custom context as described in Part 1
// import debug from 'debug';

import otpService from '../../common/services/otp.services';
import { CreateUserDTO } from '../dto/create.user.dto';
import { User } from '../types/user.type';
import { catchError } from '../../common/helpers/catch.helper';
import { OtpObject } from '../../common/types/otpObject.types';
import { response } from '../../common/types/response.types';
import { Pill } from '../types/pill.type';
import { encryptionData } from '../types/encryptionData.type';
import { validateUserDTO } from '../dto/validate.user.dto';
import { getUserDTO } from '../dto/get.user.dto';
// const log: debug.IDebugger = debug('app:users-controller');
class UsersController {

    sendOTP = async (req: express.Request, res: express.Response) => {
        const emailId = req.body.EMAILID;
        const otpObject: OtpObject = await otpService.createOTP(emailId);
        await otpService.sendOtpMail(emailId, otpObject.otp!);
        const status = 200;
        const response: response = {success: true, code: status, data: {message: "OTP sent successfully", data: {fullHash: otpObject.fullHash}}};
        res.status(status).json(response);
    }

    validateOTP = async (req: express.Request, res: express.Response) => {
        const validation = await loginService.otpValidation(req.body.EMAILID, req.body.HASH, req.body.OTP)
        if (validation == true) {
            res.status(204).json({success: true, code: 204, data: {message: "OTP matched"}});
        }
        else if (validation == false) {
            res.status(401).json({success: false, code: 401, data: {message: "OTP did not match"}});
        }
    }

    createUser = async (req: express.Request, res: express.Response) => {
        const emailId = req.body.EMAILID;
        const password = req.body.PASSWORD;
        const encryptedPill: Pill = await loginService.createAuthPill(emailId, password);
        const userData: User = {TITLE: req.body.TITLE, EMAILID: req.body.EMAILID, FIRSTNAME: req.body.FIRSTNAME, LASTNAME: req.body.LASTNAME, GENDER: req.body.GENDER, DOB: req.body.DOB}
        const createUserData: CreateUserDTO = {USER: userData, AUTH: encryptedPill};
        const data = await loginHttpService.storeUserData(createUserData);
        console.log("UsersController:createUser", data);
        if (data!== undefined) {
            if (data.code === 201) {
                console.log("2")
                return res.status(201).json({success: true, code: 201, data: {message: "User created successfully"}});
            }
            else {
                return res.status(400).json({success: false, code: 400, data: {message: "Something went wrong"}});
            }
        }
        else {
            return res.status(400).json({success: false, code: 400, data: {message: "Something went wrong"}});
        }
    }

    loginUser = async (req: express.Request, res: express.Response) => {
        const emailId = req.body.EMAILID;
        const password = req.body.PASSWORD;
        // const encryptedPill: Pill = await loginService.createAuthPill(emailId, password);
        const encryptionData: encryptionData = await loginService.createUserAuth(emailId, password);
        const usernameHash = encryptionData.usernameHash;
        const providedUserAuth = encryptionData.userAuth;
        const userAuthCheck: validateUserDTO = {USERNAMEHASH: usernameHash, USERAUTH: providedUserAuth}
        const authPillData = await loginHttpService.checkAuth(userAuthCheck);

        if (authPillData?.code !== 200) {
            res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
        }
        const pillObject: {authPill: string} = authPillData?.data?.data as unknown as {authPill: string};
        const authPill = pillObject.authPill;
        const pill = authPill.substring(providedUserAuth.length + 1, authPill.length);
        const oldPassword = await loginService.decryptAuthPill(pill, password, encryptionData.key, encryptionData.customSalt);
        if (password === oldPassword) {
            const emailObject: getUserDTO = {EMAILID: emailId};
            const userData = await loginHttpService.getUserDetails(emailObject);
            if (userData){
                res.status(200).json({success: true, code: 200, data: {message: "Logged in successfully", data: userData.data!.data!}});
            }
            else {
                res.status(400).json({success: false, code: 401, data: {message: "Something went wrong"}});
            }
        }
        else {
            res.status(401).json({success: false, code: 401, data: {message: "Invalid username/password"}});
        }
    }

    encryptUserData = async(req: express.Request, res: express.Response) => {
        try {
            const emailId = req.body.EMAILID;
            const password = req.body.PASSWORD;
            const encryptedPill: Pill = await loginService.createAuthPill(emailId, password);
            res.status(200).json({success: true, code: 200, data: {message: "Done", data: encryptedPill}});
        } catch(e: unknown) {
            console.log(catchError(e));
        }
    }

    // decryptUserData = async(req: express.Request, res: express.Response) => {
    //     try {
    //         const pill = req.body.PILL;
    //         const password = req.body.PASSWORD;
    //         const storedPassword: string = await loginService.decryptAuthPill(pill, password);
    //         res.status(200).json({success: true, code: 200, data: {message: "Done", data: storedPassword}});
    //     } catch(e: unknown) {
    //         console.log(catchError(e));
    //     }
    // }
    
}

export default new UsersController();