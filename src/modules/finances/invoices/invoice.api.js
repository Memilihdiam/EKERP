const route = require('express').Router();
const { verifyToken } = require('../../../middlewares/middleware');
const controller = require('./invoice.controller');

route.get('/', verifyToken, controller.getAllInvoices);
route.get ('/client/:clientId', verifyToken, controller.getInvoicesClient);
route.get('/:invoiceId', verifyToken, controller.getInvoiceDetail);


route.post('/', verifyToken, controller.addInvoice);

module.exports = route;