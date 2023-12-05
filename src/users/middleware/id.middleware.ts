import { Request, Response, NextFunction } from "express";
import { catchError } from "../../common/utils/catch.util";
import { RequestIdService } from '../../common/services/requestId/requestId.service';

class IdMiddleware {
    private requestIdService: RequestIdService;

    constructor() {
        this.requestIdService = new RequestIdService();
    }

    createRequestId = async(req: Request, _res: Response, next: NextFunction) => {
        try {
            const sessionId = req.header("SESSIONID")!;
            await this.requestIdService.setRequestId(sessionId);
            next();
        } catch(error: unknown) {
            const errorMsg = await catchError(error);
            console.log("IdClass:createRequestId::error", errorMsg)
        }
        
    }
}

export default new IdMiddleware();