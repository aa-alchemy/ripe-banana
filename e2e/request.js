const app = require('../lib/temp-app');
const request = require('supertest');

module.exports = request(app);