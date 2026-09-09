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

module.exports = { httpStatus, typeLetter, sourceType };