import axios, { AxiosRequestConfig} from 'axios';
import { catchError } from '../helpers/catch.helper';

class HttpRequestService {
    async getRequest(url: string): Promise<unknown> {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: url,
            data: {}
        };
        try {
            return await axios(config);
        }
        catch(e: unknown) {
            console.log(await catchError(e));
        }
    }

    async postRequest(url: string, data: object): Promise<response | undefined> {
            const config: AxiosRequestConfig = {
                method: 'post',
                url: url,
                data: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json'
                  }
            };
            let res: response | undefined;
            try 
            {
                res = await axios(config);
                // return _data.data;
            }
            catch(e: unknown) {
                console.log(await catchError(e));
            }
            return res;
    }
}

export default new HttpRequestService()