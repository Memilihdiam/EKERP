const httpStatus = {
    ok: 200,
    created: 201,
    badRequest: 400,
    unathorized: 401,
    forbidden: 403,
    notFound: 404,
    internalServerError: 500
}

const typeLetter = {
    spr: 'SPR', // Surat Peringatan
    spb: 'SPB', // Surat Permintaan Barang
    sph: 'SPH', // Surat Penawaran Harga
    spu: 'SPU', // Surat Pengumuman
    und: 'UND', // Surat Undangan
    spm: 'SPM', // Surat Permohonan
    spp: 'SPP', // Surat Permintaan Penawaran
    sps: 'SPS', // Surat Pesanan Barang
    sjl: 'SJL', // Surat Jalan
    stg: 'STG', // Surat Tagihan
    skt: 'SKT', // Surat Keterangan
    stu: 'STU', // Surat Tugas
    skp: 'SKP', // Surat Keputusan
    sed: 'SED', // Surat Edaran
    spt: 'SPT', // Surat Pemberitahuan
    skf: 'SKF', // Surat Konfirmasi
    sku: 'SKU', // Surat Kuasa
    sjp: 'SJP', // Surat Perjanjian
    skn: 'SKN', // Surat Kontrak
    sbl: 'SBL', // Surat Balasan
    srk: 'SRK', // Surat Rekomendasi
    slm: 'SLM', // Surat Lamaran
    smt: 'SMT', // Surat Mutasi
    sct: 'SCT', // Surat Cuti
    sdn: 'SDN', // Surat Dinas
    inv: 'INV', // Invoice
}

const sourceType = {
    quotation: 'client_quotations'
}

const invoiceSource = {
    purchaseOrders: 'purchase_orders'
}

const statusList = [
    { name: 'Draft', value: 'DRAFT', level: 1, modul: ['REQUEST FOR QUOTATION', 'QUOTATION', 'PURCHASE ORDERS', 'PURCHASE REQUESTS'] },
    { name: 'Submitted', value: 'SUBMITTED', level: 2, modul: ['REQUEST FOR QUOTATION', 'QUOTATION', 'PURCHASE REQUESTS'] },
    { name: 'Under Review', value: 'UNDER_REVIEW', level: 3, modul: ['REQUEST FOR QUOTATION'] },
    { name: 'Quoted', value: 'QUOTED', level: 4, modul: ['REQUEST FOR QUOTATION'] },
    { name: 'Closed', value: 'CLOSED', level: 5, modul: ['REQUEST FOR QUOTATION'] },
    { name: 'Cancelled', value: 'CANCELLED', level: 99, modul: ['REQUEST FOR QUOTATION', 'QUOTATION', 'PURCHASE ORDERS'] },
    { name: 'Sent', value: 'SENT', level: 3, modul: ['QUOTATION'] },
    { name: 'Negotiation', value: 'NEGOTIATION', level: 4, modul: ['QUOTATION'] },
    { name: 'Accepted', value: 'ACCEPTED', level: 5, modul: ['QUOTATION'] },
    { name: 'Expired', value: 'EXPIRED', level: 99, modul: ['QUOTATION'] },
    { name: 'Send To Vendor', value: 'SEND_TO_VENDOR', level: 2, modul: ['PURCHASE ORDERS'] },
    { name: 'On Delivery', value: 'ON_DELIVERY', level: 3, modul: ['PURCHASE ORDERS'] },
    { name: 'Completed', value: 'COMPLETED', level: 5, modul: ['PURCHASE ORDERS'] },
    { name: 'Manager Approved', value: 'MANAGER_APPROVED', level: 3, modul: ['PURCHASE REQUESTS'] },
    { name: 'Finance Approved', value: 'FINANCE_APPROVED', level: 4, modul: ['PURCHASE REQUESTS'] },
    { name: 'Rejected', value: 'REJECTED', level: 99, modul: ['QUOTATION', 'PURCHASE REQUESTS'] },
    { name: 'Processed', value: 'PROCESSED', level: 5, modul: ['PURCHASE ORDERS'] },
]

module.exports = { httpStatus, typeLetter, sourceType, invoiceSource, statusList };