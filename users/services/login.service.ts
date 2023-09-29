import OtpService from '../../common/services/otp.services'
import EncryptionService from '../../common/services/encryption.services'
// import {Pill} from '../types/pill.type'

class LoginService {

    private secretKey = process.env.SECRETKEY!
    async otpValidation(emailId: string, hash: string, otp: string) {
        return OtpService.verifyOTP(emailId, hash, otp);
    }

    async createOTP(email: string): Promise<OtpObject> {
        return OtpService.createOTP(email);
    }

    async createAuthPill(emailId: string, password: string): Promise<Pill> {
        // let secretKey = process.env.SECRETKEY!
        // let customSalt = await EncryptionService.createSalt();
        const customSalt = await EncryptionService.md5Encryption(password);
        console.log(customSalt, "customSalt");
        const key = await EncryptionService.scrypt(customSalt, this.secretKey);
        console.log(key, "key");
        const encryptedData = await EncryptionService.aesEencryption(key, password);
        console.log(encryptedData, "encryptedData");
        const pill = customSalt + encryptedData;
        console.log(pill, "pill");
        const passwordSalt = (await EncryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        console.log(passwordSalt, "passwordSalt");
        const passwordHash = (await EncryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        console.log(passwordHash, "passwordHash");
        const usernameHash = await EncryptionService.sha256Encryption(emailId);
        // let data: Pill = {usernameHash: usernameHash, passwordHash: passwordHash, pill: pill};
        const userAuth = await EncryptionService.hmac(key, usernameHash+passwordHash);
        console.log(userAuth, "userAuth");
        const authPill = userAuth + pill;
        console.log(authPill, "authPill");
        const data = {
            AUTHPILL: authPill,
            USERNAMEHASH: usernameHash
        }
        return data;
    }
}

export default new LoginService();