'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const shopModel= require('../models/shop.model');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
}

class AccessService {

    // sign up
    static signUp = async({ name, email, password }) => {
        try {
            /*
                step 1: check email exist?
                step 2: hash password with bcrypt algorithm
            */

            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Email already exists',
                    status: 'error'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10);

            // if the user don't have an account
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                // create a new private key and public key pair
                // save private key to sign the token
                // save public key to verify the token

                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                });

                console.log({ privateKey, publicKey }); // save to collections keyStore

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if (!publicKeyString) {
                    return {
                        code: 'xxxx',
                        message: 'Public key string error',
                        status: 'error'
                    }
                }

                // created token pair
                const tokens = await createTokenPair({
                        userId: newShop._id,
                        email
                    },
                    publicKey,
                    privateKey
                );

                console.log(`Created token pair successfully::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return error;
        }
    }
}

module.exports = AccessService;