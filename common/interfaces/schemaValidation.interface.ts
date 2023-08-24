import express from 'express'
import { errorMessageObject } from '../types/errorMsgObject.types';

export interface CommonSchemaValidator{
    validateRequest(reqBody: Express.Request, key: string): errorMessageObject;
}