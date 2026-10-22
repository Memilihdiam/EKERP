const redisClient = require("../../../config/redis");
const { httpStatus } = require("../../../utils/util");
const repository = require('./overreview.repository');

exports.countProcurementStatus = async () => {
    const cachedKey = 'review';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return JSON.parse(cacheData) ;
    }

    const projects = await repository.countProjectsStatus();
    if(!projects){
        projects = [{
            project_draft: 0,
            project_running: 0,
            project_completed: 0,
            project_cancelled: 0
        }];
    }

    const clientsStatus = await repository.countClientsStatus();
    if(!clientsStatus){
        clientsStatus = [{
            client_active: 0,
            client_inactive: 0
        }];
    }

    const review = {
        projects,
        clientsStatus
    }

    await redisClient.set(cachedKey, JSON.stringify(review), 'EX', cachedEx);
    return {projects, clientsStatus};
}

exports.valueProject = async () => {
    const cachedKey = 'value-project';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { value: JSON.parse(cacheData) };
    }

    const value = await repository.valueClientProject();
    if(!value){
        value = [{
            quotation_value: 0,
            po_value: 0
        }];
    }

    await redisClient.set(cachedKey, JSON.stringify(value), 'EX', cachedEx);
    return { value }
}

exports.paymentInvoicesBasedStatus = async () => {
    const cachedKey = 'payment-invoice';
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if(cacheData){
        return { payment: JSON.parse(cacheData) };
    }

    const payment = await repository.paymentInvoiceBasedStatus();
    if(!payment){
        payment = [{
            paid_payment: 0,
            unpaid_payment: 0
        }]
    }

    await redisClient.set(cachedKey, JSON.stringify(payment), 'EX', cachedEx);
    return { payment };
}