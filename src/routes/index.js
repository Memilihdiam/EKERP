const route = require('express').Router();

const auth = require('../middlewares/auth.api.js');
const roles = require('../modules/cores/roles/role.api.js');
const users = require('../modules/hris/users/user.api');
const employees = require('../modules/hris/employees/employee.api.js');
const jobs = require('../modules/hris/jobs/job.api.js');
const projects = require('../modules/projects/managements/management.api');
const clients = require('../modules/procurements/clients/clients.api');
const crfqs = require('../modules/procurements/client_rfq/rfq.api');
const cquots = require('../modules/procurements/client_quotation/quotation.api.js');
const po = require('../modules/procurements/purchase_order/po.api.js');
const invoice = require('../modules/finances/invoices/invoice.api.js');
const notifications = require('../modules/cores/notifications/notification.api.js');

route.use('/auth', auth);
route.use('/roles', roles);
route.use('/users', users);
route.use('/employees', employees);
route.use('/jobs', jobs);
route.use('/projects', projects);
route.use('/clients', clients);
route.use('/crfqs', crfqs );
route.use('/cquots', cquots);
route.use('/po', po);
route.use('/invoices', invoice);
route.use('/notifications', notifications);

module.exports = route;