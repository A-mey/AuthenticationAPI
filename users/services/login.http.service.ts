import HttpRequestService from '../../common/services/httpRequest.services'
// import {Pill} from '../types/pill.type'
// import { Response } from '../../common/types/response.types'
import { CreateUser } from '../types/create.user.type'


class LoginHTTPService {

    async storeUserData(CreateUser: CreateUser): Promise<response | undefined> {
        const url: string = process.env.storeUserDataURL!;
        return await HttpRequestService.postRequest(url, CreateUser);
    }

    async checkAuth(encryptedPill: Pill): Promise<response | undefined> {
        const url = process.env.checkAuthURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }

    async getUserDetails(emailId: string): Promise<response | undefined> {
        const url = process.env.getUserDetailsURL!;
        const data = {EMAILID: emailId};
        return await HttpRequestService.postRequest(url, data);
    }

    async checkExistingUser(emailId: string): Promise<response | undefined> {
        const url = process.env.checkExistingUserURL!;
        const data = {
            "EMAILID": emailId
        }
        const _data = await HttpRequestService.postRequest(url, data);
        console.log("LoginHTTPService::checkExistingUser: ", _data)
        return _data;
    }

    async createNewAuth(encryptedPill: Pill): Promise<response | undefined> {
        const url = process.env.storeAuthDataURL!;
        return await HttpRequestService.postRequest(url, encryptedPill);
    }
}

export default new LoginHTTPService();