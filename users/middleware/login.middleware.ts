import { NextFunction, Request, Response } from 'express';
// import debug from 'debug';
import loginDao from '../dao/login.http.service';
import { getUserDTO } from '../dto/get.user.dto';
import { response } from '../../common/types/response.types';

// const log: debug.IDebugger = debug('app:users-controller');
class LoginMiddleware {
    checkWhetherUserExists = async (req: Request, res: Response, next: NextFunction) => {
        let returnData: response = {success: false, code: 400, data: {message: "something went wrong"} };
        const emailIdObject: getUserDTO = { EMAILID: req.body.EMAILID };
        const response = await loginDao.getUserByEmailId(emailIdObject);
        console.log("LoginMiddleware::checkExistingUser: ", response);
        if (response.code === 500) {
            returnData = response;
        }
        if (req.originalUrl == '/loginUser') {
            if (response.code == 200) {
                next();
            }
            else {
                returnData.data.message = response?.data.message || returnData.data.message;
            }
        } else if (req.originalUrl == '/createOTP') {
            if (response.code == 200) {
                returnData.code = 409;
                returnData.data.message = response.data.message;
            }
            else {
                next();
            }
        }
        res.status(returnData.code).json(returnData);
    }
}

export default new LoginMiddleware();