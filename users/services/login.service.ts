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
        const key = await EncryptionService.scrypt(customSalt, this.secretKey);
        const encryptedData = await EncryptionService.aesEencryption(key, password);
        const pill = customSalt + encryptedData
        const passwordSalt = (await EncryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        const passwordHash = (await EncryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        const usernameHash = await EncryptionService.sha256Encryption(emailId);
        // let data: Pill = {usernameHash: usernameHash, passwordHash: passwordHash, pill: pill};
        const userAuth = await EncryptionService.hmac(key, usernameHash+passwordHash);
        const authPill = userAuth + pill;
        const data = {
            AUTHPILL: authPill,
            USERNAMEHASH: usernameHash
        }
        return data;
    }
}

export default new LoginService();