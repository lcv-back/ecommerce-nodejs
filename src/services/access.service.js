'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const shopModel = require('../models/shop.model');
const { getInfoData } = require('../utils');

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
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                });

                // pkcs1: public key cryptography standards 1

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

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                // created token pair
                const tokens = await createTokenPair({
                        userId: newShop._id,
                        email
                    },
                    publicKeyString,
                    privateKey
                );

                console.log(`Created token pair successfully::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
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