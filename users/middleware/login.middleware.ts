import { NextFunction, Request, Response } from 'express';
// import debug from 'debug';
import loginHttpService from '../services/login.http.service';

// const log: debug.IDebugger = debug('app:users-controller');
class LoginMiddleware {
    async checkExistingUser(req: Request, res: Response, next: NextFunction) {
        const _data = await loginHttpService.checkExistingUser(req.body.EMAILID)
        if (req.body.FLAG == 'LOGIN'){
            if (_data.code == 200) {
                next();
            }
            else {
                res.status(400).json({success: false, code: 400, data: {message: _data.data.message} })
            }
        }
        else if (req.body.FLAG == 'REGISTER') {
            if (_data.code == 200) {
                res.status(409).json({success: false, code: 409, data: {message: _data.data.message}})
            }
            else {
                next();
            }
        }
        
    }
}

export default new LoginMiddleware();