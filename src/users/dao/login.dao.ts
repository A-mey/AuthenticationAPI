import HttpRequestService from '../../common/services/http/http.services'
import { response } from '../../common/types/response.types';
// import {Pill} from '../types/pill.type'
// import { Response } from '../../common/types/response.types'
import { CreateUserDTO } from '../dto/create.user.dto'
import { validateUserDTO } from '../dto/validate.user.dto';
import { Pill } from '../types/pill.type';
import { getUserDTO } from '../dto/get.user.dto';
import { NullException } from '../../common/error/exceptions/null.exception.error';
import { catchError } from '../../common/utils/catch.util';


export class LoginDao {

    storeUserData = async (CreateUser: CreateUserDTO): Promise<response> => {
        try {
            const url: string = process.env.storeUserDataURL!;
            if (!url) {
                throw new NullException();
            }
            return await HttpRequestService.postRequest(url, CreateUser);
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }

    checkAuth = async (userAuth: validateUserDTO): Promise<response> => {
        try {
            const url = process.env.checkAuthURL!;
            if (!url) {
                throw new NullException();
            }
            return await HttpRequestService.postRequest(url, userAuth);
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }

    getUserDetailsThroughEmailId = async (emailIdObject: getUserDTO): Promise<response> => {
        try {
            const url = process.env.getUserDetailsURL!;
            if (!url) {
                throw new NullException();
            }
            const response = await HttpRequestService.postRequest(url, emailIdObject);
            return response; 
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }

    checkWhetherUserExistsThoughEmailId = async (emailIdObject: getUserDTO): Promise<response> => {
        try {
            const url = process.env.checkExistingUserURL!;
            if (!url) {
                throw new NullException();
            }
            const response = await HttpRequestService.postRequest(url, emailIdObject);
            console.log("response1234", response)
            return response;
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
    }

    createNewAuth = async (encryptedPill: Pill): Promise<response> => {
        try {
            const url = process.env.storeAuthDataURL!;
            if (!url) {
                throw new NullException();
            }
            return await HttpRequestService.postRequest(url, encryptedPill);
        } catch (error: unknown) {
            throw new Error(await catchError(error));
        }
        
    }
}