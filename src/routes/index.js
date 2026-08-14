const route = require('express').Router();

const users = require('../modules/hris/users/user.api');
const projects = require('../modules/projects/managements/management.api');
const clients = require('../modules/procurements/clients/clients.api');

route.use('/users', users);
route.use('/projects', projects);
route.use('/clients', clients);

module.exports = route;