import {MailService} from './mailer.services';
import EncryptionService from './encryption.services';
import { OtpObject } from '../types/otpObject.types';
import { mailBody } from '../types/mailBody.types';
import { randomNumberGenerator } from '../utils/random.util';
import { catchError } from '../utils/catch.util';

const key: string = 'MySecretKey';

export class OtpService {
    createOTPObject = async (emailId: string): Promise<OtpObject> => {
        try {
            const otp = await randomNumberGenerator();
            console.log("otp", otp);
            const fullHash:string = await this.getOtpFullHash(emailId, otp);
            const otpObj: OtpObject = {
                otp: otp,
                fullHash: fullHash
            }
            return otpObj;
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }

    getOtpFullHash = async (emailId: string, otp: string): Promise<string> => {
        const otpValidationTime: string = process.env.OTPVALIDATIONTIME || '2'
        const otpValidationTimeInMins: number = parseInt(otpValidationTime, 10);
        const ttl = otpValidationTimeInMins * 60 * 1000; //5 Minutes in miliseconds
        const expires = Date.now() + ttl; //timestamp to 5 minutes in the future
        const dataToBeHashed = `${emailId}.${otp}.${expires}`; // phone.otp.expiry_timestamp
        const hash = await EncryptionService.hmac(key, dataToBeHashed) // creating SHA256 hash of the data
        const fullHash:string = `${hash}.${expires}`; // Hash.expires, format to send to the user
        return fullHash;
    }
    
    verifyOTP = async (emailId: string, hash: string, otp: string): Promise<boolean> => {
        let isOtpValid = false;
        // Seperate Hash value and expires from the hash returned from the user
        const [hashValue,expires] = hash.split(".");
        // Check if expiry time has passed
        const now = Date.now();
        if(now < parseInt(expires)) {
            // Calculate new hash with the same key and the same algorithm
            const data  = `${emailId}.${otp}.${expires}`;
            const newCalculatedHash = await EncryptionService.hmac(key, data);
            if(newCalculatedHash.toString() === hashValue){
                isOtpValid = true;
            }
        }
        return isOtpValid;

    }

    sendOtpMail = async (emailId: string, otp: string): Promise<void> => {
        const emailRecipient: string = emailId;
        const subject: string =  'OTP';
        let body: string = "Your OTP is ${otp}";
        const mailService = new MailService();
        body = body.replace("${otp}", otp);
        const mailBody: mailBody = {EMAILRECIPIENT: emailRecipient, SUBJECT: subject, BODY: body}
        return await mailService.send(mailBody);
    }


}

// export default new OtpService()