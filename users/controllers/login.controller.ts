import express from 'express';

// we import our newly created user services
import loginService from '../services/login.service';
import loginHttpService from '../services/login.http.service';

// we use debug with a custom context as described in Part 1
// import debug from 'debug';

import otpService from '../../common/services/otp.services';
import { CreateUser } from '../types/create.user.type';
// import { catchError } from '../../common/helpers/catch.helper';
import { User } from '../types/user.type';
// import { Response } from '../../common/types/response.types';

// const log: debug.IDebugger = debug('app:users-controller');
class UsersController {

    async sendOTP(req: express.Request, res: express.Response) {
        const emailId = req.body.EMAILID;
        const otpObject: OtpObject = await otpService.createOTP(emailId);
        await otpService.sendOtpMail(emailId, otpObject.otp!);
        const status = 200;
        const response: response = {success: true, code: status, data: {message: "OTP sent successfully", data: {fullHash: otpObject.fullHash}}};
        res.status(status).json(response);
    }

    async validateOTP(req: express.Request, res: express.Response) {
        const validation = await loginService.otpValidation(req.body.EMAILID, req.body.HASH, req.body.OTP)
        if (validation == true) {
            res.status(204).json({success: true, code: 204, data: {message: "OTP matched"}});
        }
        else if (validation == false) {
            res.status(401).json({success: false, code: 401, data: {message: "OTP did not match"}});
        }
    }

    async createUser(req: express.Request, res: express.Response) {
        const emailId = req.body.EMAILID;
        const password = req.body.PASSWORD;
        const encryptedPill: Pill = await loginService.createAuthPill(emailId, password);
        const userData: User = {TITLE: req.body.TITLE, EMAILID: req.body.EMAILID, FIRSTNAME: req.body.FIRSTNAME, LASTNAME: req.body.LASTNAME, GENDER: req.body.GENDER, DOB: req.body.DOB}
        const createUserData: CreateUser = {USER: userData, AUTH: encryptedPill};
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

    async loginUser(req: express.Request, res: express.Response) {
        const emailId = req.body.EMAILID;
        const password = req.body.password;
        const encryptedPill: Pill = await loginService.createAuthPill(emailId, password);
        const authenticateUser = await loginHttpService.checkAuth(encryptedPill);
        if (authenticateUser?.code == 200) {
            // res.status(200).send();
            const userData = await loginHttpService.getUserDetails(emailId);
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
}

export default new UsersController();