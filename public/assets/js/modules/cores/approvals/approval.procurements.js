import { put } from "../../../shared/api.js";

export async function updateStatus(url, item) {
    if (!url) {
        throw new Error(`API "${url}" belum tersedia`);
    }

    const response = await put(url, item)

    if (response.success === false) {
        throw new Error(`Gagal update status ${url}`);
    }

    return response;
}
