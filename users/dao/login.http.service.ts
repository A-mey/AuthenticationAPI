import HttpRequestService from '../../common/services/http/http.services'
import { response } from '../../common/types/response.types';
// import {Pill} from '../types/pill.type'
// import { Response } from '../../common/types/response.types'
import { CreateUserDTO } from '../dto/create.user.dto'
import { validateUserDTO } from '../dto/validate.user.dto';
import { Pill } from '../types/pill.type';
import { getUserDTO } from '../dto/get.user.dto';


class LoginDao {

    storeUserData = async (CreateUser: CreateUserDTO): Promise<response> => {
        const url: string = process.env.storeUserDataURL!;
        return await HttpRequestService.postRequest(url, CreateUser);
    }

    checkAuth = async (userAuth: validateUserDTO): Promise<response> => {
        const url = process.env.checkAuthURL!;
        return await HttpRequestService.postRequest(url, userAuth);
    }

    getUserDetails = async (emailIdObject: getUserDTO): Promise<response> => {
        const url = process.env.getUserDetailsURL!;
        // const data = {EMAILID: emailId};
        return await HttpRequestService.postRequest(url, emailIdObject);
    }

    getUserByEmailId = async (emailIdObject: getUserDTO): Promise<response> => {
        const url = process.env.checkExistingUserURL!;
        const response = await HttpRequestService.postRequest(url, emailIdObject);
        return response;
    }

    createNewAuth = async (encryptedPill: Pill): Promise<response> => {
        const url = process.env.storeAuthDataURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }
}

export default new LoginDao();