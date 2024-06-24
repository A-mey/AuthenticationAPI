import express from 'express';

export interface ILoginControllerInterface {
    sendOTP (req: express.Request, res: express.Response) : Promise<void>

    validateOTP (req: express.Request, res: express.Response) : Promise<void>

    createUser (req: express.Request, res: express.Response) : Promise<void>

    returnUserData (req: express.Request, res: express.Response) : Promise<void>
}