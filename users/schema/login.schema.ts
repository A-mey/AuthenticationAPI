import { CommonSchema } from "../../common/schema/schema";

class LoginSchema extends CommonSchema{


    constructor() {
        super()
        // this.ajv = super.getAjv()
    }

    public readonly schema = {
        "createOTP" : {
            "type": "object",
            "additionalProperties": false,
            "required": ["EMAILID"],
            "properties" : {
                "EMAILID": {
                    "type": "string",
                    "format": "email"
                }
            },
        },
        "validateOTP": {
            "type": "object",
            "additionalProperties": false,
            "required": ["EMAILID", "HASH", "OTP"],
            "properties" : {
                "EMAILID": {
                    "type": "string",
                    "format": "email"
                },
                "HASH": {
                    "type": "string",
                },
                "OTP": {
                    "type": "string",
                },
            },
        },
        "registerUser": {
            "type": "object",
            "additionalProperties": false,
            "required": ["EMAILID", "PASSWORD", "FIRSTNAME", "FLAG"],
            "properties" : {
                "EMAILID": {
                    "type": "string",
                    "format": "email"
                },
                "PASSWORD": {
                    "type": "string",
                },
                "FIRSTNAME": {
                    "type": "string"
                },
                "LASTNAME": {
                    "type": "string"
                },
                "FLAG": {
                    "type": "string",
                    "enum": ["REGISTER"]
                }
            },
        },
        "loginUser": {
            "type": "object",
            "additionalProperties": false,
            "required": ["EMAILID", "PASSWORD", "FLAG"],
            "properties" : {
                "EMAILID": {
                    "type": "string",
                    "format": "email"
                },
                "PASSWORD": {
                    "type": "string",
                },
                "FLAG": {
                    "type": "string",
                    "enum": ["LOGIN"]
                }
            },
        }
    }


    // public registerUserSchemaValidate = this.ajv.compile(this.registerUserSchema)

    // public validateOTPSchemaValidate = this.ajv.compile(this.validateOTPSchema)

    // public createOTPSchemaValidate = this.ajv.compile(this.createOTPSchema);

    // public loginUserSchemaValidate = this.ajv.compile(this.loginUserSchema);
}

export default new LoginSchema();