import { isAxiosError } from "axios";
import { catchError } from "./catch.util";

export const axiosErrorHandler = async (error: unknown) => {
    let errorMessage: string;
    if (isAxiosError(error)){
        console.log("error", error.response);
        errorMessage = error.response?.data || error.message;
    } else {
        errorMessage = await catchError(error);
    }
    return errorMessage;
}