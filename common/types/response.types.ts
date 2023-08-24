export type Response = {
    success: boolean,
    code: number,
    data: {message: string, data?: object}
}