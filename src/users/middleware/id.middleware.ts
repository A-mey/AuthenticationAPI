import { Request, Response, NextFunction } from "express";
import {set} from "express-http-context";
import { GuidService } from "../../common/services/guid.services"
import { catchError } from "../../common/utils/catch.util";

class IdMiddleware {
    private guid: GuidService;

    constructor() {
        this.guid = new GuidService();
    }

    createRequestId = async(req: Request, _res: Response, next: NextFunction) => {
        try {
            const sessionId = req.header("SESSIONID");
            const guid = this.guid.getGuid();
            const requestId = sessionId + "_" + guid;
            set("requestId", requestId);
            next();
        } catch(error: unknown) {
            const errorMsg = await catchError(error);
            console.log("IdClass:createRequestId::error", errorMsg)
        }
        
    }
}

export default new IdMiddleware();