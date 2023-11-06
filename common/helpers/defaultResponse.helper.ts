import { response } from "../types/response.types";

export const defaultResponse: response = {
    code: 500,
    success: false,
    data: {
        message: "Something went wrong"
    }
};