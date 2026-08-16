const route = require('express').Router();

const users = require('../modules/hris/users/user.api');
const projects = require('../modules/projects/managements/management.api');
const clients = require('../modules/procurements/clients/clients.api');
const crfqs = require('../modules/procurements/client_rfq/rfq.api');

route.use('/users', users);
route.use('/projects', projects);
route.use('/clients', clients);
route.use('/crfqs', crfqs );

module.exports = route;