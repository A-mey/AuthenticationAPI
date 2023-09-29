import CryptoJS from 'crypto-js';

import crypto from 'crypto';

import SHA256 from 'crypto-js/sha256';

import { scryptSync, randomBytes } from 'crypto';

class EncryptionService {
    async createSalt() {
        return randomBytes(16).toString("hex")
    }

    async md5Encryption(value: string) {
        return CryptoJS.MD5(value).toString();
    }

    async scrypt(value: string, salt: string) {
        return scryptSync(value, salt, 32).toString("hex");
    }

    async aesEncryption(key: string, value: string) {
        return CryptoJS.AES.encrypt(value, key).toString();
    }

    aesDecryption = async(key: string, value: string) => {
        return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    }

    async sha256Encryption(value: string) {
        return SHA256(value).toString();
    }

    async hmac(key: string, value: string) {
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