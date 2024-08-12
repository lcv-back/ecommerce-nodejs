'use strict';

const { findById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async(req, res, next) => {
    try {
        // if (req.headers[HEADER.API_KEY]) {
        //     const key = req.headers[HEADER.API_KEY].toString();
        // }

        const key = req.headers[HEADER.API_KEY] ? req.headers[HEADER.API_KEY].toString() : null;


        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error: API key is required'
            });
        }

        // check object key
        const objKey = await findById(key);

        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error: Object key is required'
            });
        }

        req.objKey = objKey;
        return next();

    } catch (error) {
        console.error(error);
        return error;
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Forbidden Error: Permissions required'
            });
        }

        // check if permission is valid
        console.log('permission::', req.objKey.permissions);

        const validPermission = req.objKey.permissions.includes(permission);

        if (!validPermission) {
            return res.status(403).json({
                message: 'Forbidden Error: Permissions denied'
            });
        }

        return next();
    }
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


module.exports = {
    apiKey,
    permission,
    asyncHandler,
};