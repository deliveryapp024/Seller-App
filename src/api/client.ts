import { API_CONFIG } from '../constants/apiConfig';

// API Response types
export interface ApiError {
    message: string;
    error?: string;
}

export interface ApiResult<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiFailure {
    success: false;
    error: string;
}

export type ApiResponse<T> = ApiResult<T> | ApiFailure;

// Get auth token from memory (sync)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

export const getAuthToken = (): string | null => authToken;

// Base request function
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Dev-only debug logging for x-request-id header
        if (__DEV__) {
            const requestId = response.headers.get('x-request-id');
            const method = options.method || 'GET';
            if (requestId) {
                console.log(`[API] ${method} ${endpoint} - x-request-id: ${requestId}`);
            }
        }

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || data.error || `HTTP ${response.status}`,
            };
        }

        return {
            success: true,
            data,
            message: data.message,
        };
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
        };
    }
}

// HTTP method helpers
export const apiClient = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
        request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
