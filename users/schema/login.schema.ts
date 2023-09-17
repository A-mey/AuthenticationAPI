class LoginSchema {


    constructor() { }

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
            "required": ["EMAILID", "PASSWORD", "FIRSTNAME", "GENDER", "DOB"],
            "properties" : {
                "TITLE": {
                    "type": "number",
                    "enum": [1, 2, 3]
                },
                "EMAILID": {
                    "type": "string",
                    "format": "email"
                },
                "PASSWORD": {
                    "type": "string",
                },
                "PASSWORD2": {
                    "type": "string",
                },
                "FIRSTNAME": {
                    "type": "string"
                },
                "LASTNAME": {
                    "type": "string"
                },
                "GENDER": {
                    "type": "number",
                    "enum": [1, 2]
                },
                "DOB": {
                    "type": "string",
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
}

export default new LoginSchema();