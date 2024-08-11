'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async({ userId, publicKey, privateKey }) => {

        if (!publicKey) {
            throw new Error("Public key is required");
        }

        if (!privateKey) {
            throw new Error("Private key is required");
        }

        try {
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyTokenService;