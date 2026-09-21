const { httpStatus } = require("../../../utils/util");
const service = require('./invoice.service');

exports.getAllInvoices = async (req, res) => {
    try{
        const { invoices } = await service.getAllInvoice();

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfully Fetch Data',
            invoices
        })
    }catch(err){
        console.log(err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getInvoicesClient = async (req, res) => {
    const { clientId } = req.params;

    try{
        const { invoices } = await service.getInvoicesClient(clientId);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            invoices
        })
    }catch(err){
        console.log(err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.getInvoiceDetail = async (req, res) => {
    const { invoiceId } = req.params;

    try{
        const { invoiceData, invoiceItems, invoiceTermin } = await service.getInvoiceDetail(invoiceId);

        res.status(httpStatus.ok).json({
            success: true,
            message: 'Successfuly Fetch Data',
            invoiceData,
            invoiceItems,
            invoiceTermin
        })
    }catch(err){
        console.log(err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}

exports.addInvoice = async (req, res) => {
    const { id } = req.user;
    const { invoiceData, invoiceItems } = req.body;
    try{
        if(!invoiceData.created_by){
            invoiceData.created_by = id;
        }

        await service.addInvoice(invoiceData, invoiceItems);

        res.status(httpStatus.created).json({
            success: true,
            message: 'Successfuly Fetch Data'
        })
    }catch(err){
        console.log('Error While Create Invoice, ', err);
        return res.status(err.statusCode || httpStatus.internalServerError).json({
            success: false,
            message: err.message || 'Internal Server Error'
        })
    }
}