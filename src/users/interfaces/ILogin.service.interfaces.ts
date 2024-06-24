import { OtpObject } from "../../common/types/otpObject.types"
import { response } from "../../common/types/response.types"
import { CreateUserDTO } from "../dto/create.user.dto"
import { getUserDTO } from "../dto/get.user.dto"
import { validateUserDTO } from "../dto/validate.user.dto"
import { encryptionData } from "../types/encryptionData.type"
import { Pill } from "../types/pill.type"
import { createUserInput } from '../types/create.user.input.type';

export interface ILoginServiceInterface {
    authenticateUserData (userAuthCheck: validateUserDTO): Promise<response>
    getUserDetails (emailObject: getUserDTO): Promise<response>
    createNewUser (createUserData: CreateUserDTO): Promise<response>
    getOtpObject (emailId: string) : Promise<OtpObject>
    sendOtpViaMail (emailId: string, otp: string) : Promise<void>
    checkWhetherOtpIsValid (emailId: string, hash: string, otp: string) : Promise<boolean>
    createAuthPill (emailId: string, password: string): Promise<Pill>
    createUserAuth (emailId: string, password: string): Promise<encryptionData>
    decryptAuthPill (pill: string, key: string, customSalt: string) : Promise<string>
    createUserData (createUserInput: createUserInput) : Promise<CreateUserDTO>
    getOldPassword (encryptionData: encryptionData) : Promise<string>
    checkWhetherUserExists (emailId: string) : Promise<boolean>
}