export interface httpReq {
    get: () => Promise<unknown>;
    post: (url: string, data: object) => Promise<unknown>;
}