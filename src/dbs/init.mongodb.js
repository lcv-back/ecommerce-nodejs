'use strict';

const mongoose = require('mongoose');
const { db: { host, name, port } } = require('../configs/config.mongodb');
const { countConnect } = require('../helpers/check.connect');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {

    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {

        if (1 == 1) { // if doing on development environment
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString, {
                maxPoolSize: 50
            })
            .then(_ => {
                console.log(`Connected Mongodb Success`)
                countConnect()
            })
            .catch(err => console.log(`Error Connecting`))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;