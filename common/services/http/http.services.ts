import { catchError } from "../../utils/catch.util";
import { response } from "../../types/response.types";
import CommonHttpService from "./common.http.service";
import responseTemplateConstants from "../../constants/response.template.constants";

class HttpRequestService {
	async getRequest(url: string): Promise<response> {
		let returnData: response = responseTemplateConstants.DEFAULT_ERROR;
		try {
			returnData = await CommonHttpService.httpRequest(url, {}, "get");
		} catch (e: unknown) {
			console.log(await catchError(e));
		}
		return returnData;
	}

	async postRequest(url: string, data: object): Promise<response> {
		let returnData: response = responseTemplateConstants.DEFAULT_ERROR;
		try {
			returnData = await CommonHttpService.httpRequest(url, data, "post");
		} catch (e: unknown) {
			console.log(await catchError(e));
		}
		return returnData;
	}
}

export default new HttpRequestService();