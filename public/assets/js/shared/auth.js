/**
 * Menangani error otentikasi dengan mengarahkan pengguna ke halaman login.
 * @param {Error} error - Objek error yang ditangkap.
 */
export function handleAuthError(error) {
    console.error('Authentication error:', error);
    const message = error.message.toLowerCase();

    const isAuthError =
        message.includes('invalid token') ||
        message.includes('session') ||
        message.includes('unauthorized');
        
    if (isAuthError) {
        window.location.href = '/';
    }
}
