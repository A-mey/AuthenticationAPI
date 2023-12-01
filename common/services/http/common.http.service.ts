import axios, { AxiosRequestConfig, AxiosResponse} from "axios";
import { response } from "../../types/response.types";
import { httpMethod } from "../../types/httpMethods.type";
import { NullException } from "../../error/exceptions/null.exception.error";
import { axiosErrorHandler } from "../../utils/axiosError.util";

class CommonHttpService {
	httpRequest = async(url: string, data: object, method: httpMethod) : Promise<response> => {
		let res: response;
		try {
			const config: AxiosRequestConfig = {
				method: method,
				url: url,
				data: method === "post"? JSON.stringify(data): data,
				headers: { 
					"Content-Type": "application/json"
				}
			};
			const httpResponse: AxiosResponse = await axios(config);
			if (!httpResponse) {
				throw new NullException();
			}
			res = httpResponse as unknown as response;
			console.log(httpResponse.data);
			res = httpResponse.data;
		} catch(error: unknown) {
			throw new Error(await axiosErrorHandler(error));
		}
		return res;
	}
}

export default new CommonHttpService();