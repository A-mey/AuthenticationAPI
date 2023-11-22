import HttpRequestService from '../../common/services/http/http.services'
import { response } from '../../common/types/response.types';
// import {Pill} from '../types/pill.type'
// import { Response } from '../../common/types/response.types'
import { CreateUserDTO } from '../dto/create.user.dto'
import { validateUserDTO } from '../dto/validate.user.dto';
import { Pill } from '../types/pill.type';
import { getUserDTO } from '../dto/get.user.dto';
import { NullException } from '../../common/error/exceptions/null.exception.error';


class LoginDao {

    storeUserData = async (CreateUser: CreateUserDTO): Promise<response> => {
        const url: string = process.env.storeUserDataURL!;
        if (!url) {
            throw new NullException();
        }
        return await HttpRequestService.postRequest(url, CreateUser);
    }

    checkAuth = async (userAuth: validateUserDTO): Promise<response> => {
        const url = process.env.checkAuthURL!;
        if (!url) {
            throw new NullException();
        }
        return await HttpRequestService.postRequest(url, userAuth);
    }

    getUserDetailsThroughEmailId = async (emailIdObject: getUserDTO): Promise<response> => {
        const url = process.env.getUserDetailsURL!;
        if (!url) {
            throw new NullException();
        }
        const response = await HttpRequestService.postRequest(url, emailIdObject);
        return response; 
    }

    checkWhetherUserExistsThoughEmailId = async (emailIdObject: getUserDTO): Promise<response> => {
        const url = process.env.checkExistingUserURL!;
        if (!url) {
            throw new NullException();
        }
        const response = await HttpRequestService.postRequest(url, emailIdObject);
        return response;
    }

    createNewAuth = async (encryptedPill: Pill): Promise<response> => {
        const url = process.env.storeAuthDataURL!;
        if (!url) {
            throw new NullException();
        }
        return await HttpRequestService.postRequest(url, encryptedPill);
    }
}

export default new LoginDao();