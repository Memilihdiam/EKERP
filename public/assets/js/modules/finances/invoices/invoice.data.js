import { get, apiEndpoints } from "../../../shared/api.js";

export async function fetchAllInvoices(){
    const response = await get(apiEndpoints.invoices);
    return response
}

export async function fetchInvoicesClient(clientId){
    const response = await get(apiEndpoints.invoicesClient(clientId));
    return response.invoices;
}

export async function fetchInvoiceDetail(invoiceId){
    const response = await get(apiEndpoints.invoiceDetail(invoiceId));
    return response;
}