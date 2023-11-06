import OtpService from '../../common/services/otp.services'
import EncryptionService from '../../common/services/encryption.services'
import {Pill} from '../types/pill.type'
import { OtpObject } from '../../common/types/otpObject.types';
import { encryptionData } from '../types/encryptionData.type';
import { CreateUserDTO } from '../dto/create.user.dto';
import { User } from '../types/user.type';
import { createUserInput } from "../types/create.user.input.type"

class LoginService {

    private secretKey = process.env.SECRETKEY!
    checkWhetherOtpIsValid = async (emailId: string, hash: string, otp: string) => {
        return OtpService.verifyOTP(emailId, hash, otp);
    }

    createOTP = async (email: string): Promise<OtpObject> => {
        return OtpService.createOTPObject(email);
    }

    createAuthPill = async (emailId: string, password: string): Promise<Pill> => {
        const encryptionData: encryptionData = await this.createUserAuth(emailId, password);
        const key = encryptionData.key;
        const userAuth = encryptionData.userAuth;
        const customSalt = encryptionData.customSalt;
        const usernameHash = encryptionData.usernameHash;
        const encryptedData = await EncryptionService.aesEncryption(key, password);
        const pill = customSalt + encryptedData;
        const authPill = userAuth + pill;
        const data = {
            AUTHPILL: authPill,
            USERNAMEHASH: usernameHash
        }
        return data;
    }

    createUserAuth = async (emailId: string, password: string): Promise<encryptionData> => {
        const userAuthObject: encryptionData = {customSalt: "", key: "", usernameHash: "", userAuth: ""};
        const customSalt = await EncryptionService.md5Encryption(password);
        const key = await EncryptionService.scrypt(customSalt, this.secretKey);
        const usernameHash = await EncryptionService.sha256Encryption(emailId);
        const passwordSalt = (await EncryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        const passwordHash = (await EncryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        const userAuth = await EncryptionService.hmac(key, usernameHash+passwordHash);
        userAuthObject.customSalt = customSalt;
        userAuthObject.key = key;
        userAuthObject.userAuth = userAuth;
        userAuthObject.usernameHash = usernameHash;
        return userAuthObject;
    }

    decryptAuthPill = async (pill: string, password: string, key: string, customSalt: string) => {
        const encryptedData = pill.substring(customSalt.length, pill.length);
        const mySecret = await EncryptionService.aesDecryption(key, encryptedData);
        return mySecret;
    }

    createUserData = async (createUserInput: createUserInput) : Promise<CreateUserDTO> => {
        const emailId = createUserInput.EMAILID;
        const password = createUserInput.PASSWORD;
        const encryptedPill: Pill = await this.createAuthPill(emailId, password);
        const userData: User = {TITLE: createUserInput.TITLE, EMAILID: createUserInput.EMAILID, FIRSTNAME: createUserInput.FIRSTNAME, LASTNAME: createUserInput.LASTNAME, GENDER: createUserInput.GENDER, DOB: createUserInput.DOB}
        const createUserData: CreateUserDTO = {USER: userData, AUTH: encryptedPill};
        return createUserData;
    }

    errorThrower = async(a: string) => {
        if (a === "1") {
            throw new Error("test error");
        } else {
            return "0";
        }
    }
}

export default new LoginService();