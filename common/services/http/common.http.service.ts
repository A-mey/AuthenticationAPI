import axios, { AxiosRequestConfig, AxiosResponse} from "axios";
// import { catchError } from "../../helpers/catchError.helper";
import { response } from "../../types/response.types";
import { httpMethod } from "../../types/httpMethods.type";

class CommonHttpService {
	httpRequest = async(url: string, data: object, method: httpMethod) => {
		const config: AxiosRequestConfig = {
			method: method,
			url: url,
			data: method === "post"? JSON.stringify(data): data,
			headers: { 
				"Content-Type": "application/json"
			}
		};
		let res: response | undefined;
		try 
		{
			const httpResponse: AxiosResponse = await axios(config);
			console.log(httpResponse, "httpResponse");
			console.log(httpResponse.data);
			res = httpResponse.data;
		}
		catch(e: unknown) {
			if (axios.isAxiosError(e)){
				console.log("error", e.response);
				res = e.response?.data;
			}
		}
		return res;
	}
}

export default new CommonHttpService();