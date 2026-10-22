export const apiEndpoints = {
    // === CORES ===
    // === Auth ===
    login: '/api/users',
    session: '/api/auth/session',
    user: '/api/users/me',
    password: '/api/users/me/password',

    // === Job ===
    job: '/api/jobs/',
    
    // === Notification ===
    urgentTask: '/api/notifications/tasks/urgent',
    
    // === Review ===
    procurementsReview: '/api/reviews/procurements',
    valueProject: '/api/reviews/projects/value',
    paymentInvoice: '/api/reviews/invoices/summary',
    
    // === Approval ===
    clientProcurementsApproval: '/api/approvals/procurements',

    // === File ===
    employeePhotoProfile: `/api/files/employees/profile-picture`,
    
    // === HUMAN RESOURCE MANAGEMENT ===
    // === Employee ===
    employee: '/api/employees',
    addData: '/api/employees/data/add/employee',

    // === PROJECT MANAGEMENTS ===
    // === Project ===
    allProject: '/api/projects',
    detailProject: (id) => `/api/projects/${id}`,
    
    // === CLIENTS MANAGEMENTS ===
    // === Client ===
    clients: '/api/clients',
    detailClient: (id) => `/api/clients/${id}`,
    addPic: '/api/clients/pic',
    industries: '/api/clients/industry',
    
    // === Request Of Quotation ===
    rfqsClients: '/api/crfqs',
    rfqsClientDetail: (id) => `/api/crfqs/detail/${id}`,
    rfqsClient: (id) => `/api/crfqs/${id}`,
    updateRFQStatus: '/api/crfqs/status/update',
    
    // === Quotation ===
    quotation: '/api/cquots',
    quotationDetail: (id) => `/api/cquots/${id}`,
    quotationClient: (id) => `/api/cquots/client/${id}`,
    updateQuotStatus: '/api/cquots/status/update',
    
    // === Purchase Order ===
    purchaseOrders: '/api/po',
    poClient: (clientId) => `/api/po/client/${clientId}`,
    poDetail: (id) => `/api/po/${id}`,
    updatePOStatus: '/api/po/status/update',
    
    updatePRStatus: '/api/status/update',
    // === FINANCE ===
    // === Invoice ===
    invoices: '/api/invoices',
    invoicesClient: (clientId) => `/api/invoices/client/${clientId}`,
    invoiceDetail: (invoiceId) => `/api/invoices/${invoiceId}`
}

async function get(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Send cookies with the request
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (err) {
        console.error('Error, ', err);
        throw err;
    }
}

async function post(url, body) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;

    } catch (err) {
        console.error('Error, ', err);
        throw err;
    }
}

async function put(url, body) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (err) {
        console.log('Error, ', err);
        throw err;
    }
}

export { get, post, put };