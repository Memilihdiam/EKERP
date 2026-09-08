const route = require('express').Router();

const auth = require('../middlewares/auth.api.js');
const users = require('../modules/hris/users/user.api');
const projects = require('../modules/projects/managements/management.api');
const clients = require('../modules/procurements/clients/clients.api');
const crfqs = require('../modules/procurements/client_rfq/rfq.api');
const cquots = require('../modules/procurements/client_quotation/quotation.api.js');
const po = require('../modules/procurements/purchase_order/po.api.js');

route.use('/auth', auth);
route.use('/users', users);
route.use('/projects', projects);
route.use('/clients', clients);
route.use('/crfqs', crfqs );
route.use('/cquots', cquots);
route.use('/po', po);

module.exports = route;