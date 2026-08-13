const route = require('express').Router();

const users = require('../modules/hris/users/user.api');
const projects = require('../modules/projects/managements/management.api');

route.use('/users', users);
route.use('/projects', projects);

module.exports = route;