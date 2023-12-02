import { NextFunction } from "express";

export interface CommonSchemaValidator{
    checkSchema(req: Express.Request, res: Express.Request, next: NextFunction): Promise<void>;
}