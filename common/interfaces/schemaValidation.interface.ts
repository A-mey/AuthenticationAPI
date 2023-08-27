export interface CommonSchemaValidator{
    validateRequest(reqBody: Express.Request, key: string): errorMessageObject;
}