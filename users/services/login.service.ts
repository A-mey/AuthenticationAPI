import OtpService from '../../common/services/otp.services'
import EncryptionService from '../../common/services/encryption.services'
import {Pill} from '../types/pill.type'
import { OtpObject } from '../../common/types/otpObject.types';
import { encryptionData } from '../types/encryptionData.type';

class LoginService {

    private secretKey = process.env.SECRETKEY!
    otpValidation = async (emailId: string, hash: string, otp: string) => {
        return OtpService.verifyOTP(emailId, hash, otp);
    }

    createOTP = async (email: string): Promise<OtpObject> => {
        return OtpService.createOTP(email);
    }

    createAuthPill = async (emailId: string, password: string): Promise<Pill> => {
        // let secretKey = process.env.SECRETKEY!
        // let customSalt = await EncryptionService.createSalt();
        // const customSalt = await EncryptionService.md5Encryption(password);
        // const key = await EncryptionService.scrypt(customSalt, this.secretKey);
        const encryptionData: encryptionData = await this.createUserAuth(emailId, password);
        const key = encryptionData.key;
        const userAuth = encryptionData.userAuth;
        const customSalt = encryptionData.customSalt;
        const usernameHash = encryptionData.usernameHash;
        const encryptedData = await EncryptionService.aesEncryption(key, password);
        const pill = customSalt + encryptedData;
        // const passwordSalt = (await EncryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        // const passwordHash = (await EncryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        // const usernameHash = await EncryptionService.sha256Encryption(emailId);
        // const userAuth = await EncryptionService.hmac(key, usernameHash+passwordHash);
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

    decryptAuthPill = async(pill: string, password: string, key: string, customSalt: string) => {
        const encryptedData = pill.substring(customSalt.length, pill.length);
        const mySecret = await EncryptionService.aesDecryption(key, encryptedData);
        return mySecret;
        // const oldPassword = await EncryptionService.aesDecryption("e2e73172fbb15e03f336d85a7129e47a6f23e5643fccf43a81c8ad644e16d89f", "U2FsdGVkX18Yiso3Yvquw+g+YaIVFEGkykwzmk7Nn9g=");
        // return oldPassword;
    }
}

export default new LoginService();