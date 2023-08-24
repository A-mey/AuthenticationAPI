import OtpService from '../../common/services/otp.services'
import {OtpObject} from '../../common/types/otpObject.types'
import EncryptionService from '../../common/services/encryption.services'
import {Pill} from '../types/pill.type'
import { CreateUser } from '../types/create.user.type'


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
        let customSalt = await EncryptionService.md5Encryption(password);
        let key = await EncryptionService.scrypt(customSalt, this.secretKey);
        let encryptedData = await EncryptionService.aesEencryption(key, password);
        let pill = customSalt + encryptedData
        let passwordSalt = (await EncryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        let passwordHash = (await EncryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        let usernameHash = await EncryptionService.sha256Encryption(emailId);
        // let data: Pill = {usernameHash: usernameHash, passwordHash: passwordHash, pill: pill};
        let userAuth = await EncryptionService.hmac(key, usernameHash+passwordHash);
        let authPill = userAuth + pill;
        let data = {
            AUTHPILL: authPill,
            USERNAMEHASH: usernameHash
        }
        return data;
    }
}

export default new LoginService();