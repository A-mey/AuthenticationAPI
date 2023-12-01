import { Guid } from "guid-typescript";
 
export class GuidService {
    private guid: Guid;
    constructor() {
        this.guid = Guid.create();
    }

    getGuid = () => {
        return this.guid.toString();
    }
}