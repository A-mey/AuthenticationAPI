import axios, { AxiosRequestConfig} from 'axios';

class HttpRequestService {
    async getRequest(url: string): Promise<any> {
        let config: AxiosRequestConfig = {
            method: 'get',
            url: url,
            data: {}
        };
        try {
            return await axios(config);
        }
        catch(e: any) {
            return e.message;
        }
    }

    async postRequest(url: string, data: object): Promise<any> {
            let config: AxiosRequestConfig = {
                method: 'post',
                url: url,
                data: JSON.stringify(data),
                headers: { 
                    'Content-Type': 'application/json'
                  }
            };
            try 
            {
                let _data = await axios(config);
                return _data.data;
            }
            catch(e: any) {
                return e;
            }
    }
}

export default new HttpRequestService()