import { GuidService } from "../guid.services";
import { HttpContextService } from "./httpContext.requestId.service"

export class RequestIdService {
    httpContextService: HttpContextService

    constructor() {
        this.httpContextService = new HttpContextService();
    }

    setRequestId = async (sessionId: string): Promise<void> => {
        const guidService = new GuidService()
        const guid = guidService.getGuid();
        const requestId = sessionId + "_" + guid;
        await this.httpContextService.setHttpContext("requestId", requestId);
    }

    getRequestId = async (key: string): Promise<unknown> => {
        return this.httpContextService.getHttpContext(key);
    }
}