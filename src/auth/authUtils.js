'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        // create access token through private key
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        });

        // create access token through private key
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        });

        // access token same as refresh token different by expired

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decoded::`, decoded);
            }
        })

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
}

module.exports = {
    createTokenPair,
}