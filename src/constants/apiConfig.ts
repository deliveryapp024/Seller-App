// API Configuration for Seller App
// Single source of truth for all API endpoints

export const API_CONFIG = {
    // IMPORTANT:
    // - Most backend routes are under /api (e.g. POST /api/auth/otp/test)
    // - Health endpoint is /health (no /api prefix)
    API_ORIGIN: __DEV__ ? 'http://10.0.2.2:5000' : 'http://144.91.71.57:5000',
    API_PREFIX: '/api',
    // Full base URL for API calls
    BASE_URL: (__DEV__ ? 'http://10.0.2.2:5000' : 'http://144.91.71.57:5000') + '/api',
    TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: '@seller_auth_token',
    USER_DATA: '@seller_user_data',
};
