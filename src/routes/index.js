'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// address middlware pre handle system

// check api key
router.use(apiKey);

// check permissions
router.use(permission('0000'));

// status access into account
router.use('/v1/api', require('./access'));


module.exports = router;