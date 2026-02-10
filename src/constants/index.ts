// App-wide constants for Seller App

export const APP_NAME = 'SellerApp';

// Feature flags for Phase 0 MVP pilot
// Set to false to hide mock-only features during pilot
export const FEATURE_FLAGS = {
    // Mock-only screens - disable for Phase 0 pilot
    ENABLE_ORDERS_TAB: false,     // Order management (needs backend integration)
    ENABLE_MENU_TAB: false,       // Menu management (needs backend integration)
    ENABLE_PAYOUTS_TAB: false,    // Earnings/payouts (needs backend integration)

    // Working features - enable for Phase 0
    ENABLE_OUTLET_SETTINGS: true, // Outlet location + delivery radius (wired to backend)
    ENABLE_SETTINGS: true,        // App settings (theme, notifications, etc.)
    ENABLE_SUPPORT: true,         // Help & support
};
