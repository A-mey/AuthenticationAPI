import {set, get} from "express-http-context";

export class HttpContextService {
    
    setHttpContext = async (key: string, value: unknown) : Promise<void> => {
        set(key, value);
    }

    getHttpContext = async (key: string) : Promise<unknown> => {
        return get(key);
    }
}
