import { response } from "../../../types/response.types";
import express from 'express';

class NotFoundController {
    httpStatus = 404;

    notFoundResponse = async (req: express.Request, res: express.Response) => {
        const response: response = {
            success: false,
            code: this.httpStatus,
            data: {
                message: "Path not found"
            }
        };
        res.status(this.httpStatus).json(response);
    }
}

export default new NotFoundController();