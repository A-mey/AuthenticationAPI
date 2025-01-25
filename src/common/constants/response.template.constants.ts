import { response } from "../types/response.types";

class ResponseTemplates {

    // Default error
    DEFAULT_ERROR: response = {code: 500, success: false, data: {message: "Something went wrong"}};

    // Schema validation error
    SCHEMA_VALIDATION_ERROR = {success: true, code: 400, data: {message: ""}};

    // OTP
    // Successfully sent
    OTP_SENT = {success: true, code: 200, data: {message: "OTP sent successfully", data: {}}};

    // Successfully validated
    OTP_MATCHED_SUCCESS = {success: true, code: 200, data: {message: "OTP matched"}};

    // Failed to validate
    OTP_MATCHED_FAILURE = {success: true, code: 401, data: {message: "OTP did not match"}};

    // Middleware
    // User not found
    USER_NOT_FOUND = {success: true, code: 404, data: {message: "No such user found"}};

    // Emailid already exists
    ALREADY_EXISTS = {success: true, code: 409, data: {message: "This email Id already exists"}};

    // Invalid credentials
    INVALID_CREDENTIALS = {success: false, code: 401, data: {message: "Invalid username/password"}};
}

export default new ResponseTemplates();