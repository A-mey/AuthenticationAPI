import { NextFunction, Request, Response } from 'express';
// import debug from 'debug';
import loginHttpService from '../services/login.http.service';
import { getUserDTO } from '../dto/get.user.dto';

// const log: debug.IDebugger = debug('app:users-controller');
class LoginMiddleware {
    checkExistingUser = async (req: Request, res: Response, next: NextFunction) => {
        const emailIdObject: getUserDTO = { EMAILID: req.body.EMAILID };
        const data = await loginHttpService.checkExistingUser(emailIdObject);
        console.log("LoginMiddleware::checkExistingUser: ", data);
        if (!data) {
                return res.status(400).json({success: false, code: 400, data: {message: "something went wrong"} })
        }
        if (req.originalUrl == '/loginUser'){
            if (data.code == 200) {
                next();
            }
            else {
                res.status(400).json({success: false, code: 400, data: {message: data.data.message} })
            }
        }
        else if (req.originalUrl == '/createOTP') {
            if (data.code == 200) {
                res.status(409).json({success: false, code: 409, data: {message: data.data.message}})
            }
            else {
                next();
            }
        }
        
    }
}

export default new LoginMiddleware();