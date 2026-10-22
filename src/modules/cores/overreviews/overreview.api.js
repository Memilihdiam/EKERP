const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./overreview.controller');

route.get('/procurements', verifyToken, controller.countProcurementStatus);
route.get('/projects/value', verifyToken, controller.valueProject);
route.get('/invoices/summary', verifyToken, controller.paymentInvoicesBasedStatus);

module.exports = route;