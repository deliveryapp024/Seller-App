import { apiClient, ApiResponse } from './client';

// Location Types
export interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface SetLocationRequest {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface SetLocationResponse {
    success: boolean;
    message: string;
    storeLocation: {
        latitude: number;
        longitude: number;
        address: string;
        isSet: boolean;
    };
}

export interface GetLocationResponse {
    success: boolean;
    storeLocation: {
        latitude: number | null;
        longitude: number | null;
        address: string;
        isSet: boolean;
    };
}

// Delivery Area Types
export interface DeliveryAreaData {
    radius: number;
    unit: string;
    isActive: boolean;
    updatedAt?: string;
    storeLocation?: {
        latitude: number;
        longitude: number;
        address: string;
    };
}

export interface SetDeliveryAreaRequest {
    radius: number;
    unit?: string;
}

export interface SetDeliveryAreaResponse {
    success: boolean;
    message: string;
    deliveryArea: {
        radius: number;
        unit: string;
        isActive: boolean;
        updatedAt: string;
    };
}

export interface GetDeliveryAreaResponse {
    success: boolean;
    radius: number;
    unit: string;
    isActive: boolean;
    updatedAt: string;
    storeLocation?: {
        latitude: number;
        longitude: number;
        address: string;
    };
}

// ==================== Location APIs ====================

/**
 * Get seller store location
 * GET /api/seller/location
 */
export const getStoreLocation = async (): Promise<ApiResponse<GetLocationResponse>> => {
    return apiClient.get<GetLocationResponse>('/seller/location');
};

/**
 * Set seller store location (for new sellers)
 * POST /api/seller/location
 */
export const setStoreLocation = async (data: SetLocationRequest): Promise<ApiResponse<SetLocationResponse>> => {
    return apiClient.post<SetLocationResponse>('/seller/location', data);
};

/**
 * Update seller store location (for existing sellers)
 * PUT /api/seller/location
 */
export const updateStoreLocation = async (data: SetLocationRequest): Promise<ApiResponse<SetLocationResponse>> => {
    return apiClient.put<SetLocationResponse>('/seller/location', data);
};

// ==================== Delivery Area APIs ====================

/**
 * Get delivery area settings
 * GET /api/seller/delivery-area
 */
export const getDeliveryArea = async (): Promise<ApiResponse<GetDeliveryAreaResponse>> => {
    return apiClient.get<GetDeliveryAreaResponse>('/seller/delivery-area');
};

/**
 * Set/update delivery area radius
 * PUT /api/seller/delivery-area
 * @param radius - Delivery radius in km (1-10 for pilot)
 * @param unit - Unit of measurement (default: 'km')
 */
export const setDeliveryArea = async (
    radius: number,
    unit: string = 'km'
): Promise<ApiResponse<SetDeliveryAreaResponse>> => {
    return apiClient.put<SetDeliveryAreaResponse>('/seller/delivery-area', { radius, unit });
};

/**
 * Clear/reset delivery area
 * DELETE /api/seller/delivery-area
 */
export const clearDeliveryArea = async (): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    return apiClient.delete<{ success: boolean; message: string }>('/seller/delivery-area');
};

// ==================== Validation Helpers ====================

/**
 * Validate radius for Phase 0 pilot (1-10 km)
 * Returns { isValid: boolean, error?: string }
 */
export const validateDeliveryRadius = (radius: number): { isValid: boolean; error?: string } => {
    if (isNaN(radius) || radius <= 0) {
        return { isValid: false, error: 'Please enter a valid radius' };
    }
    if (radius < 1) {
        return { isValid: false, error: 'Minimum delivery radius is 1 km for pilot' };
    }
    if (radius > 10) {
        return { isValid: false, error: 'Maximum delivery radius is 10 km for pilot' };
    }
    return { isValid: true };
};

/**
 * Format radius for display
 */
export const formatRadius = (radius: number, unit: string = 'km'): string => {
    return `${radius} ${unit}`;
};
