import { response } from "../../types/response.types";
import CommonHttpService from "./common.http.service";

class HttpRequestService {
	async getRequest(url: string): Promise<response | undefined> {
		// const config: AxiosRequestConfig = {
		// 	method: "get",
		// 	url: url,
		// 	data: {}
		// };
		// let res: response | undefined;
		// try 
		// {
		// 	const httpResponse: AxiosResponse = await axios(config);
		// 	console.log(httpResponse, "httpResponse");
		// 	console.log(httpResponse.data);
		// 	res = httpResponse.data;
		// }
		// catch(e: unknown) {
		// 	console.log(await catchError(e));
		// }
		// return res;
        return CommonHttpService.httpRequest(url, {}, "get");
	}

	async postRequest(url: string, data: object): Promise<response | undefined> {
		// const config: AxiosRequestConfig = {
		// 	method: "post",
		// 	url: url,
		// 	data: JSON.stringify(data),
		// 	headers: { 
		// 		"Content-Type": "application/json"
		// 	}
		// };
		// let res: response | undefined;
		// try 
		// {
		// 	const httpResponse: AxiosResponse = await axios(config);
		// 	console.log(httpResponse, "httpResponse");
		// 	console.log(httpResponse.data);
		// 	res = httpResponse.data;
		// }
		// catch(e: unknown) {
		// 	if (axios.isAxiosError(e)){
		// 		console.log("error", e.response);
		// 		res = e.response?.data;
		// 	}
		// }
		// return res;
        return CommonHttpService.httpRequest(url, data, "post"); 
	}
}

export default new HttpRequestService();