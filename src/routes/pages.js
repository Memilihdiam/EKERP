const route = require('express').Router();
const path = require('path');

route.get('/projects/project-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/projects/project-detail.html'));
});

route.get('/clients/client-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/clients/client-detail.html'));
});

route.get('/clients/rfq-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/clients/rfq-detail.html'));
});

route.get('/clients/quotation-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/clients/quotation-detail.html'));
})

route.get('/clients/po-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/clients/po-detail.html'));
})

route.get('/finances/invoices/invoice-detail/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/finances/invoices/invoice-detail.html'));
})
module.exports = route;
