export interface httpReq {
    get: () => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
}