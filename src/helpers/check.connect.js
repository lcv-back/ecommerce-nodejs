'use strict';

const mongoose = require('mongoose');
const _SECONDS = 5000;
const os = require('os');
const process = require('process');

// count the number of connects to the database
const countConnect = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Connections: ${numConnect}`);
}

// check overloads
const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus.length;
        const memoryUsage = process.memoryUsage().rss;

        // example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;
        if (numConnect > maxConnections) {
            console.log(`Connections overload detected: ${maxConnections}`);
            console.log(`Active connections: ${numConnect}`);
            console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        }

    }, _SECONDS); // monitoring every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
};