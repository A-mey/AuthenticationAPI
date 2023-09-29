import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import { catchError } from '../helpers/catch.helper';
import { response } from '../types/response.types';

class HttpRequestService {
    getRequest = async (url: string): Promise<response | undefined> => {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: url,
            data: {}
        };
        let res: response | undefined;
            try 
            {
                res = await axios(config);
                // return _data.data;
            }
            catch(e: unknown) {
				if (axios.isAxiosError(e)){
					console.log("error", e.response);
					res = e.response?.data;
				}
				else {
					console.log(catchError(e))
				}
			}
            return res;
    }

    postRequest = async (url: string, data: object): Promise<response | undefined> => {
        const config: AxiosRequestConfig = {
			method: "post",
			url: url,
			data: JSON.stringify(data),
			headers: { 
				"Content-Type": "application/json"
			}
		};
		let res: response | undefined;
		try 
		{
			const httpResponse: AxiosResponse = await axios(config);
			console.log(httpResponse.data);
			res = httpResponse.data;
		}
		catch(e: unknown) {
			if (axios.isAxiosError(e)){
				console.log("error", e.response);
				res = e.response?.data;
			}
			else {
				console.log(catchError(e))
			}
		}
		return res;
    }
}

export default new HttpRequestService()