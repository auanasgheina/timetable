'use strict';

const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    MONGODB_USER,
    MONGODB_PASS,
} = process.env;

assert(PORT, 'PORT richiesta');
assert(HOST, 'HOST richiesto');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    mongodbUri: `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.nmvm9.mongodb.net/?retryWrites=true&w=majority`
    }
