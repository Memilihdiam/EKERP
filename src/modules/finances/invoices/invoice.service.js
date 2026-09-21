const pool = require("../../../config/db");
const redisClient = require("../../../config/redis");
const { calculatePurchaseOrderTotals, remainTermin } = require("../../../utils/calculate");
const { letterCode } = require("../../../utils/code-generator");
const { httpStatus, typeLetter, invoiceSource } = require("../../../utils/util");
const letterService = require("../../cores/letter/letter.service");
const repository = require('./invoice.repository');

exports.getAllInvoice = async () => {
    const cachedKey = 'all-invoices';
    const cachedEx = 3600;

    try {
        const cacheData = await redisClient.get(cachedKey);
        if (cacheData) {
            return { invoices: JSON.parse(cacheData) };
        }

        const invoices = await repository.getAllInvoices();
        if (invoices.length === 0) {
            return { invoices: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(invoices), 'EX', cachedEx);
        return { invoices };
    } catch (err) {
        throw err;
    }
}

exports.getInvoicesClient = async (clientId) => {
    if (!clientId) {
        const error = new Error('Attribute ID Null');
        err.statusCode = httpStatus.badRequest;
        throw err;
    }

    const cachedKey = `client-invoices:${clientId}`;
    const cachedEx = 3600;
    try {
        const cacheData = await redisClient.get(cachedKey);
        if (cacheData) {
            return { invoices: JSON.parse(cacheData) };
        }

        const invoices = await repository.getInvoicesClients(clientId);
        if (invoices.length === 0) {
            return { invoices: [] };
        }

        await redisClient.set(cachedKey, JSON.stringify(invoices), 'EX', cachedEx);
        return { invoices };
    } catch (err) {
        throw err;
    }
}

exports.getInvoiceDetail = async (invoiceId) => {
    if (!invoiceId) {
        const error = new Error('Attribute ID Null');
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const cachedKey = `detail-invoice:${invoiceId}`;
    const cachedEx = 3600;

    const cacheData = await redisClient.get(cachedKey);
    if (cacheData) {
        return JSON.parse(cacheData);
    }

    const invoiceData = await repository.getInvoicesDetail(invoiceId);
    if (!invoiceData) {
        const error = new Error(`Invoice With ID ${invoiceId} Not Found`);
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    // Ambil item dari Root Invoice (termin_group_id || invoiceId)
    const rootId = invoiceData.termin_group_id || invoiceData.id;
    let invoiceItems = await repository.getInvoiceItemsByGroup(rootId);
    if (!invoiceItems || invoiceItems.length === 0) {
        invoiceItems = [];
    }

    const invoiceTermin = await repository.getLastTerminByGroup(rootId);
    if (!invoiceTermin) {
        const error = new Error("Termin Not Found");
        error.statusCode = httpStatus.notFound;
        throw error;
    }

    const result = {
        invoiceData,
        invoiceItems,
        invoiceTermin
    };

    await redisClient.set(cachedKey, JSON.stringify(result), 'EX', cachedEx);
    return result;
}

exports.addInvoice = async (invoiceData, invoiceItems = []) => {
    if(!invoiceData){
        const error = new Error("Field Can't Be Null");
        error.statusCode = httpStatus.badRequest;
        throw error;
    }

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const type = typeLetter.inv;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        let finalInvoiceData = {};
        let currentTerminNumber = 1;
        let previousRemainPayment = 0;
        const isRootInvoice = !invoiceData.termin_group_id;

        if (isRootInvoice) {
            // ==========================================
            // ALUR 1: TERMIN PERTAMA (ROOT INVOICE)
            // ==========================================
            if (!invoiceItems || invoiceItems.length === 0) {
                const error = new Error("Invoice items required for root invoice");
                error.statusCode = httpStatus.badRequest;
                throw error;
            }

            const allowanceSourceType = Object.values(invoiceSource);
            if (!allowanceSourceType.includes(invoiceData.source_type)) {
                const error = new Error('Invalid Source Type');
                error.statusCode = httpStatus.badRequest;
                throw error;
            }

            // Hitung total nilai kontrak dari items
            const total = calculatePurchaseOrderTotals({
                items: invoiceItems, 
                shipping_cost: invoiceData.shipping_cost, 
                tax_amount: invoiceData.tax_amount
            });

            finalInvoiceData = {
                ...invoiceData,
                subtotal: total.subtotal,
                shipping_cost: total.shipping_cost,
                tax_amount: total.tax_amount,
                grand_total: total.grand_total
            };

            previousRemainPayment = total.grand_total;
        } else {
            console.log('Not Root')
            // ==========================================
            // ALUR 2: TERMIN LANJUTAN (TERMIN 2, 3, DST.)
            // ==========================================
            
            // untuk mencegah Race Condition
            const rootInvoice = await repository.lockRootInvoice(invoiceData.termin_group_id, connection);
            if (!rootInvoice) {
                const error = new Error("Termin Group Invoice Not Found");
                error.statusCode = httpStatus.notFound;
                throw error;
            }

            console.log('1')
            // Ambil termin terakhir dari kelompok ini
            const lastTermin = await repository.getLastTerminByGroup(invoiceData.termin_group_id, connection);

            if (lastTermin) {
                currentTerminNumber = lastTermin.termin_number + 1;
                previousRemainPayment = lastTermin.remain_payment;

                // Set status invoice sebelumnya menjadi DORMANT
                if (invoiceData.previous_id) {
                    await repository.updateInvoiceStatus(invoiceData.previous_id, 'DORMANT', connection);
                }
            } else {
                previousRemainPayment = rootInvoice.grand_total;
            }

            console.log('2')
            // HERITANCE
            finalInvoiceData = {
                created_by: invoiceData.created_by,
                title: invoiceData.title || rootInvoice.title,
                source_id: rootInvoice.source_id,
                source_type: rootInvoice.source_type,
                client_id: rootInvoice.client_id,
                vendor_id: rootInvoice.vendor_id,
                receiver_name: rootInvoice.receiver_name,
                receiver_address: rootInvoice.receiver_address,
                receiver_phone: rootInvoice.receiver_phone,
                receiver_email: rootInvoice.receiver_email,
                sender_name: rootInvoice.sender_name,
                sender_address: rootInvoice.sender_address,
                sender_phone: rootInvoice.sender_phone,
                sender_email: rootInvoice.sender_email,
                subtotal: rootInvoice.subtotal,
                tax_amount: rootInvoice.tax_amount,
                discount_amount: rootInvoice.discount_amount,
                shipping_cost: rootInvoice.shipping_cost,
                grand_total: rootInvoice.grand_total,
                issue_date: invoiceData.issue_date,
                due_date: invoiceData.due_date,
                status: invoiceData.status || 'DRAFT',
                payment_status: 'UNPAID',
                termin_group_id: invoiceData.termin_group_id,
                previous_id: invoiceData.previous_id || null,
                origin_id: rootInvoice.origin_id || null,
            };
        }

        console.log('3')
        // Generate Nomor Invoice Unik
        const sequence = await letterService.letterSequence(type, month, year, connection);
        if (!finalInvoiceData.invoice_number) {
            const code = await letterService.letterCode(type);
            finalInvoiceData.invoice_number = await letterCode(code, month, year, sequence);
        }

        console.log('4')
        // Simpan Record Invoice Baru
        const newInvId = await repository.addInvoices(finalInvoiceData, connection);

        console.log('5')
        // Hanya masukkan rincian item jika ini Root Invoice (Termin 1)
        if (isRootInvoice) {
            const calculatedTotal = calculatePurchaseOrderTotals({
                items: invoiceItems, 
                shipping_cost: invoiceData.shipping_cost, 
                tax_amount: invoiceData.tax_amount
            });
            await repository.addItems(newInvId, calculatedTotal.items, connection);
        }

        console.log('6')
        // Hitung sisa tagihan dan catat ke invoice_termins
        const remain = remainTermin(invoiceData.termin_payment, previousRemainPayment);
        await repository.addTermin(newInvId, currentTerminNumber, invoiceData.termin_payment, remain, connection);
        
        console.log('7')
        // Update nomor urut surat
        await letterService.addSequence(type, month, year, sequence + 1, connection);

        await connection.commit();

        if (finalInvoiceData.client_id) {
            await redisClient.del(`client-invoices:${finalInvoiceData.client_id}`);
        }
    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) connection.release();
    }
}