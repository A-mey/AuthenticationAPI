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
import { LogService } from '../../common/services/logger/log.service';
import logFactoryService from '../../common/services/logger/log.factory.service';
import { response } from '../../common/types/response.types';
import { ILoginServiceInterface } from '../interfaces/ILogin.service.interfaces';

export class LoginService implements ILoginServiceInterface {
    otpService: OtpService;
    loginDao: LoginDao;
    encryptionService: EncryptionService
    logger: LogService;

    constructor() {
        this.otpService = new OtpService();
        this.loginDao = new LoginDao();
        this.encryptionService = new EncryptionService();
        this.logger = new LogService("LoginController");
    }

    private secretKey = process.env.SECRETKEY!

    authenticateUserData = async (userAuthCheck: validateUserDTO): Promise<response> => {
        const logger = await logFactoryService.getLog(this.logger, "authenticateUserData");
        try {
            const checkAuthResponse = await this.loginDao.checkAuth(userAuthCheck);
            logger.log("checkAuthResponse", checkAuthResponse);
            return checkAuthResponse;
        } catch(error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        }
    }

    getUserDetails = async (emailObject: getUserDTO): Promise<response> => {
        const logger = await logFactoryService.getLog(this.logger, "getUserDetails");
        try {
            const userDetails = await this.loginDao.getUserDetailsThroughEmailId(emailObject);
            logger.log("userDetails", userDetails);
            return userDetails;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        }
    }

    createNewUser = async (createUserData: CreateUserDTO): Promise<response> => {
        const logger = await logFactoryService.getLog(this.logger, "createNewUser");
        try {
            const createNewUserResponse = await this.loginDao.storeUserData(createUserData);
            logger.log("createNewUserResponse", createNewUserResponse);
            return createNewUserResponse;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
    }

    getOtpObject = async (emailId: string) : Promise<OtpObject> => {
        const logger = await logFactoryService.getLog(this.logger, "getOtpObject");
        try {
            const otpObject = await this.otpService.createOTPObject(emailId);
            return otpObject;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
    }

    sendOtpViaMail = async (emailId: string, otp: string) : Promise<void> => {
        const logger = await logFactoryService.getLog(this.logger, "sendOtpViaMail");
        try {
            await this.otpService.sendOtpMail(emailId, otp!);
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
    }
    
    checkWhetherOtpIsValid = async (emailId: string, hash: string, otp: string) : Promise<boolean> => {
        const logger = await logFactoryService.getLog(this.logger, "checkWhetherOtpIsValid");
        try {
            const isOtpValid = await this.otpService.verifyOTP(emailId, hash, otp);
            return isOtpValid;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
    }

    createAuthPill = async (emailId: string, password: string): Promise<Pill> => {
        const logger = await logFactoryService.getLog(this.logger, "createAuthPill");
        try {
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
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
        
    }

    createUserAuth = async (emailId: string, password: string): Promise<encryptionData> => {
        const logger = await logFactoryService.getLog(this.logger, "authenticateUserData");
        try {
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
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
        
    }

    decryptAuthPill = async (pill: string, key: string, customSalt: string) : Promise<string> => {
        const logger = await logFactoryService.getLog(this.logger, "decryptAuthPill");
        try {
            const encryptedData = pill.substring(customSalt.length, pill.length);
            const mySecret = await this.encryptionService.aesDecryption(key, encryptedData);
            return mySecret;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
        
    }

    createUserData = async (createUserInput: createUserInput) : Promise<CreateUserDTO> => {
        const logger = await logFactoryService.getLog(this.logger, "createUserData");
        try {
            const emailId = createUserInput.EMAILID;
            const password = createUserInput.PASSWORD;
            const encryptedPill: Pill = await this.createAuthPill(emailId, password);
            const userData: User = {TITLE: createUserInput.TITLE, EMAILID: createUserInput.EMAILID, FIRSTNAME: createUserInput.FIRSTNAME, LASTNAME: createUserInput.LASTNAME, GENDER: createUserInput.GENDER, DOB: createUserInput.DOB}
            const createUserData: CreateUserDTO = {USER: userData, AUTH: encryptedPill};
            return createUserData;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        }
    }

    getOldPassword = async (encryptionData: encryptionData) : Promise<string> => {
        const logger = await logFactoryService.getLog(this.logger, "getOldPassword");
        try {
            const pill = encryptionData.authPill!.substring(encryptionData.userAuth.length, encryptionData.authPill!.length);
            if (!pill) {
                throw new NullException();
            }
            const oldPassword = await this.decryptAuthPill(pill, encryptionData.key, encryptionData.customSalt);
            return oldPassword;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        }   
    }

    checkWhetherUserExists = async (emailId: string) : Promise<boolean> => {
        const logger = await logFactoryService.getLog(this.logger, "checkWhetherUserExists");
        try {
            let proceed = false;
            const emailIdObject: getUserDTO = { EMAILID: emailId };
            const response = await this.loginDao.checkWhetherUserExistsThoughEmailId(emailIdObject);
            if (response.code === 200) {
                proceed = true;
            }
            return proceed;
        } catch (error: unknown) {
            const errorMsg = await catchError(error);
            logger.log("error", errorMsg);
            throw new Error(errorMsg);
        } 
        
    }
}