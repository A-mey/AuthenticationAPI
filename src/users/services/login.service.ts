import { OtpService } from '../../common/services/otp.services'
import { EncryptionService } from '../../common/services/encryption.services';
import { Pill } from '../types/pill.type'
import { OtpObject } from '../../common/types/otpObject.types';
import { encryptionData } from '../types/encryptionData.type';
import { CreateUserDTO } from '../dto/create.user.dto';
import { User } from '../types/user.type';
import { createUserInput } from '../types/create.user.input.type';
import { NullException } from '../../common/error/exceptions/null.exception.error';
import { LoginDao } from '../dao/login.dao';
import { getUserDTO } from '../dto/get.user.dto';
import { catchError } from '../../common/utils/catch.util';
import { validateUserDTO } from '../dto/validate.user.dto';

export class LoginService {
    otpService: OtpService;
    loginDao: LoginDao;
    encryptionService: EncryptionService

    constructor() {
        this.otpService = new OtpService();
        this.loginDao = new LoginDao();
        this.encryptionService = new EncryptionService();
    }

    private secretKey = process.env.SECRETKEY!

    authenticateUserData = async (userAuthCheck: validateUserDTO) => {
        return await this.loginDao.checkAuth(userAuthCheck);
    }

    getUserDetails = async (emailObject: getUserDTO) => {
        return await this.loginDao.getUserDetailsThroughEmailId(emailObject);
    }

    createNewUser = async (createUserData: CreateUserDTO) => {
        return await this.loginDao.storeUserData(createUserData);
    }

    getOtpObject = async (emailId: string) => {
        return await this.otpService.createOTPObject(emailId);
    }

    sendOtpViaMail = async (emailId: string, otp: string) => {
        await this.otpService.sendOtpMail(emailId, otp!);
    }
    
    checkWhetherOtpIsValid = async (emailId: string, hash: string, otp: string) => {
        return this.otpService.verifyOTP(emailId, hash, otp);
    }

    createOTP = async (email: string): Promise<OtpObject> => {
        return this.otpService.createOTPObject(email);
    }

    createAuthPill = async (emailId: string, password: string): Promise<Pill> => {
        const encryptionData: encryptionData = await this.createUserAuth(emailId, password);
        const key = encryptionData.key;
        const userAuth = encryptionData.userAuth;
        const customSalt = encryptionData.customSalt;
        const usernameHash = encryptionData.usernameHash;
        const encryptedData = await this.encryptionService.aesEncryption(key, password);
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
        const customSalt = await this.encryptionService.md5Encryption(password);
        const key = await this.encryptionService.scrypt(customSalt, this.secretKey);
        const usernameHash = await this.encryptionService.sha256Encryption(emailId);
        const passwordSalt = (await this.encryptionService.sha256Encryption(emailId + this.secretKey)).slice(-22);
        const passwordHash = (await this.encryptionService.scrypt(passwordSalt, this.secretKey)).slice(-40);
        const userAuth = await this.encryptionService.hmac(key, usernameHash+passwordHash);
        userAuthObject.customSalt = customSalt;
        userAuthObject.key = key;
        userAuthObject.userAuth = userAuth;
        userAuthObject.usernameHash = usernameHash;
        return userAuthObject;
    }

    decryptAuthPill = async (pill: string, key: string, customSalt: string) => {
        const encryptedData = pill.substring(customSalt.length, pill.length);
        const mySecret = await this.encryptionService.aesDecryption(key, encryptedData);
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

    getOldPassword = async (encryptionData: encryptionData) : Promise<string> => {
        const pill = encryptionData.authPill!.substring(encryptionData.userAuth.length, encryptionData.authPill!.length);
        if (!pill) {
            throw new NullException();
        }
        const oldPassword = await this.decryptAuthPill(pill, encryptionData.key, encryptionData.customSalt);
        return oldPassword;
    }

    checkWhetherUserExists = async (emailId: string) => {
        try {
            let proceed = false;
            const emailIdObject: getUserDTO = { EMAILID: emailId };
            const response = await this.loginDao.checkWhetherUserExistsThoughEmailId(emailIdObject);
            if (response.code === 200) {
                proceed = true;
            }
            return proceed;
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }
}