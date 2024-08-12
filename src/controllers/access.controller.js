'use strict';

const AccessService = require("../services/access.service");
const { OK, CREATED } = require('../core/success.response');

class AccessController {
    // sign up
    signUp = async(req, res, next) => {
        new CREATED({
            message: 'Registered Successfully',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }
}

module.exports = new AccessController();