'use strict';

// using the lodash dependency to get information about objects
const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

module.exports = {
    getInfoData
};