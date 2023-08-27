import Ajv from 'ajv';

export class CommonSchema {
    public readonly ajv: Ajv = new Ajv({
        discriminator: true,
        formats: {
            email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
        }
    })

    constructor() { }
}