import HttpRequestService from '../../common/services/httpRequest.services'
import {Pill} from '../types/pill.type'
import { Response } from '../../common/types/response.types'
import { CreateUser } from '../types/create.user.type'


class LoginHTTPService {

    async storeUserData(CreateUser: CreateUser): Promise<Response> {
        let url: string = process.env.storeUserDataURL!;
        
        return await HttpRequestService.postRequest(url, CreateUser);
    }

    async checkAuth(encryptedPill: Pill): Promise<Response> {
        let url = process.env.checkAuthURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }

    async getUserDetails(emailId: string): Promise<Response> {
        let url = process.env.getUserDetailsURL!;
        let data = {EMAILID: emailId};
        return await HttpRequestService.postRequest(url, data);
    }

    async checkExistingUser(emailId: string): Promise<Response> {
        let url = process.env.checkExistingUserURL!;
        let data = {
            "EMAILID": emailId
        }
        return await HttpRequestService.postRequest(url, data);
    }

    async createNewAuth(encryptedPill: Pill): Promise<Response> {
        let url = process.env.storeAuthDataURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }
}

export default new LoginHTTPService();