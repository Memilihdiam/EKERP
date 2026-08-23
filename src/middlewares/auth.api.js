const route = require('express').Router();
const auth = require('./auth');

route.get('/session', auth.checkSession);

module.exports = route;