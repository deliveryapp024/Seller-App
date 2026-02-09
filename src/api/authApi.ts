import { apiClient, ApiResponse, setAuthToken } from './client';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/apiConfig';

// Types
export interface TokenData {
    accessToken: string;
    refreshToken: string;
}

export interface UserData {
    _id: string;
    phone: string;
    name?: string;
    email?: string;
    role: string;
    isVerified: boolean;
}

export interface SendOTPResponse {
    success: boolean;
    message: string;
    otp?: string; // Only in dev/staging for testing
}

export interface VerifyOTPResponse {
    token: TokenData | string; // Object (new) or string (legacy)
    user: UserData;
}

// Load token from storage on app start
export const loadTokenFromStorage = async (): Promise<void> => {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
        setAuthToken(token);
    }
};

// Send OTP to phone
export const sendOTP = async (phone: string): Promise<ApiResponse<SendOTPResponse>> => {
    // Ensure phone has +91 prefix
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    return apiClient.post<SendOTPResponse>('/auth/seller/otp/request', { phone: formattedPhone });
};

// Verify OTP and login
export const verifyOTP = async (phone: string, otp: string): Promise<ApiResponse<VerifyOTPResponse>> => {
    // Ensure phone has +91 prefix
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    const response = await apiClient.post<VerifyOTPResponse>('/auth/seller/otp/verify', {
        phone: formattedPhone,
        otp,
    });

    // Store token on successful verification
    if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Handle token object {accessToken, refreshToken} or string (legacy)
        let accessToken: string;
        let refreshToken: string | null = null;
        
        if (typeof token === 'string') {
            accessToken = token;
        } else {
            accessToken = token.accessToken;
            refreshToken = token.refreshToken;
        }
        
        // Store in memory and persist to storage
        setAuthToken(accessToken);
        await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    return response;
};

// Logout
export const logout = async (): Promise<void> => {
    setAuthToken(null);
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Check if token exists in storage (for app startup)
export const hasStoredToken = async (): Promise<boolean> => {
    const token = await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
};
