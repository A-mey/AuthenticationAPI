export type encryptionData = {
    userAuth: string,
    key: string,
    usernameHash: string,
    customSalt: string,
    authPill?: string
}