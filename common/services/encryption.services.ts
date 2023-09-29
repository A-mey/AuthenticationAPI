import CryptoJS from 'crypto-js';

import crypto from 'crypto';

import SHA256 from 'crypto-js/sha256';

import { scryptSync, randomBytes } from 'crypto';

class EncryptionService {
    createSalt = async () => {
        return randomBytes(16).toString("hex")
    }

    md5Encryption = async (value: string) => {
        return CryptoJS.MD5(value).toString();
    }

    scrypt = (value: string, salt: string) => {
        return scryptSync(value, salt, 32).toString("hex");
    }

    aesEncryption = (key: string, value: string) => {
        return CryptoJS.AES.encrypt(value, key).toString();
    }

    aesDecryption = async(key: string, value: string) => {
        return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    }

    sha256Encryption = async (value: string) => {
        return SHA256(value).toString();
    }

    hmac = async (key: string, value: string) => {
        return crypto.createHmac("sha256",key).update(value).digest("hex")
    }

    // async createPill(value1: string, value2: string) {
    //     return value1 + value2;
    // }

    // async createPasswordSalt(value1: string, value2: string) {
    //     return SHA256(value1+value2).toString().slice(-22);
    // }


}

export default new EncryptionService()