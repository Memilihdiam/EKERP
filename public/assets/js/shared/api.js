export const apiEndpoints = {
    // === CORES ===
    login: '/api/users',
    session: '/api/auth/session',
    user: '/api/users/me',
    password: '/api/users/me/password',
    industries: '/api/clients/industry',
    job: '/api/jobs/',
    urgentTask: '/api/notifications/tasks/urgent',

    // === HUMAN RESOURCE MANAGEMENT ===
    employee: '/api/employees',
    addData: '/api/employees/data/add/employee',

    // === PROJECT MANAGEMENTS ===
    allProject: '/api/projects',
    detailProject: (id) => `/api/projects/${id}`,

    // === CLIENTS MANAGEMENTS === 
    clients: '/api/clients',
    detailClient: (id) => `/api/clients/${id}`,
    addPic: '/api/clients/pic',
    rfqsClients: '/api/crfqs',
    rfqsClientDetail: (id) => `/api/crfqs/detail/${id}`,
    rfqsClient: (id) => `/api/crfqs/${id}`,
    quotation: '/api/cquots',
    quotationDetail: (id) => `/api/cquots/${id}`,
    quotationClient: (id) => `/api/cquots/client/${id}`,
    purchaseOrders: '/api/po',
    poClient: (clientId) => `/api/po/client/${clientId}`,
    poDetail: (id) => `/api/po/${id}`,

    // === FINANCE ===
    invoices: '/api/invoices',
    invoicesClient: (clientId) => `/api/invoices/client/${clientId}`,
    invoiceDetail: (invoiceId) => `/api/invoices/${invoiceId}`
}

async function get(url){
    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Send cookies with the request
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        return data;
    }catch(err){
        console.error('Error, ', err);
        throw err;
    }
}

async function post(url, body){
    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        return data;

    }catch(err){
        console.error('Error, ', err);
        throw err;
    }
}

async function put(url, body){
    try{
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message);
        }

        return data;
    }catch(err){
        console.log('Error, ', err);
        throw err;
    }
}

export { get, post, put };