import HttpRequestService from '../../common/services/httpRequest.services'
import { response } from '../../common/types/response.types';
// import {Pill} from '../types/pill.type'
// import { Response } from '../../common/types/response.types'
import { CreateUserDTO } from '../dto/create.user.dto'
import { validateUserDTO } from '../dto/validate.user.dto';
import { Pill } from '../types/pill.type';
import { getUserDTO } from '../dto/get.user.dto';


class LoginHTTPService {

    storeUserData = async (CreateUser: CreateUserDTO): Promise<response | undefined> => {
        const url: string = process.env.storeUserDataURL!;
        return await HttpRequestService.postRequest(url, CreateUser);
    }

    checkAuth = async (userAuth: validateUserDTO): Promise<response | undefined> => {
        const url = process.env.checkAuthURL!;
        return await HttpRequestService.postRequest(url, userAuth);
    }

    getUserDetails = async (emailIdObject: getUserDTO): Promise<response | undefined> => {
        const url = process.env.getUserDetailsURL!;
        // const data = {EMAILID: emailId};
        return await HttpRequestService.postRequest(url, emailIdObject);
    }

    checkExistingUser = async (emailIdObject: getUserDTO): Promise<response | undefined> => {
        const url = process.env.checkExistingUserURL!;
        const response = await HttpRequestService.postRequest(url, emailIdObject);
        console.log("LoginHTTPService::checkExistingUser: ", response)
        return response;
    }

    createNewAuth = async (encryptedPill: Pill): Promise<response | undefined> => {
        const url = process.env.storeAuthDataURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }
}

export default new LoginHTTPService();