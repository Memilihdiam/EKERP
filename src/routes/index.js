const route = require('express').Router();
const users = require('../modules/hris/users/user.api');

route.use('/users', users);

module.exports = route;