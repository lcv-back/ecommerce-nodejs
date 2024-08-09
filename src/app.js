const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
require('dotenv').config();
// create express app
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    // support parsing of application/x-www-form-urlencoded encoded data
    // default: false
    // true for parsing JSON bodies
}));

// init database
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect')
// checkOverload()

// init routes
app.use('/', require('./routes'));
// handle errors



module.exports = app;