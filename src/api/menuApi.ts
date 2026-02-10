import { apiClient, ApiResponse } from './client';

// Product Types matching backend
export interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    quantity: string;
    description?: string;
    stock: number;
    image?: string;
    additionalImages?: string[];
    brand?: string;
    specifications?: { key: string; value: string }[];
    nutritionalInfo?: {
        servingSize?: string;
        calories?: string;
        protein?: string;
        carbs?: string;
        fat?: string;
        fiber?: string;
    };
    highlights?: string[];
    warnings?: string;
    storageInstructions?: string;
    category: {
        _id: string;
        name: string;
        image?: string;
    };
    seller: string;
    status: 'pending' | 'approved' | 'rejected';
    isActive: boolean;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    isActive: boolean;
}

// Request types
export interface CreateProductRequest {
    name: string;
    price: number;
    discountPrice?: number;
    quantity: string;
    category: string;
    description?: string;
    stock?: number;
    image?: string;
    additionalImages?: string[];
    brand?: string;
    specifications?: { key: string; value: string }[];
    nutritionalInfo?: {
        servingSize?: string;
        calories?: string;
        protein?: string;
        carbs?: string;
        fat?: string;
        fiber?: string;
    };
    highlights?: string[];
    warnings?: string;
    storageInstructions?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// ==================== Product APIs ====================

/**
 * Get all products for the authenticated seller
 * GET /api/seller/products
 */
export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    return apiClient.get<Product[]>('/seller/products');
};

/**
 * Create a new product
 * POST /api/seller/products
 */
export const createProduct = async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    return apiClient.post<Product>('/seller/products', data);
};

/**
 * Update an existing product
 * PUT /api/seller/products/:id
 */
export const updateProduct = async (productId: string, data: UpdateProductRequest): Promise<ApiResponse<Product>> => {
    return apiClient.put<Product>(`/seller/products/${productId}`, data);
};

/**
 * Delete a product
 * DELETE /api/seller/products/:id
 */
export const deleteProduct = async (productId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiClient.delete<{ message: string }>(`/seller/products/${productId}`);
};

/**
 * Toggle product active status (only for approved products)
 * PUT /api/seller/products/:id/status
 */
export const toggleProductStatus = async (productId: string): Promise<ApiResponse<{ isActive: boolean }>> => {
    return apiClient.put<{ isActive: boolean }>(`/seller/products/${productId}/status`);
};

/**
 * Get all categories
 * GET /api/seller/categories
 */
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
    return apiClient.get<Category[]>('/seller/categories');
};

// ==================== Seed Data for Testing ====================

/**
 * Sample products for Phase 0 testing
 * These can be used to quickly seed a seller's menu
 */
export const SAMPLE_PRODUCTS: CreateProductRequest[] = [
    {
        name: 'Paneer Butter Masala',
        price: 180,
        quantity: '1 plate',
        category: '', // Will be filled with actual category ID
        description: 'Creamy tomato-based curry with soft paneer cubes',
        stock: 50,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
        highlights: ['Chef Special', 'Best Seller'],
        nutritionalInfo: {
            servingSize: '300g',
            calories: '350 kcal',
            protein: '12g',
        },
    },
    {
        name: 'Chicken Biryani',
        price: 220,
        quantity: '1 plate',
        category: '',
        description: 'Aromatic basmati rice with tender chicken and spices',
        stock: 40,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
        highlights: ['Most Popular', 'Spicy'],
        nutritionalInfo: {
            servingSize: '400g',
            calories: '550 kcal',
            protein: '25g',
        },
    },
    {
        name: 'Veg Fried Rice',
        price: 120,
        quantity: '1 plate',
        category: '',
        description: 'Stir-fried rice with mixed vegetables and soy sauce',
        stock: 60,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400',
        highlights: ['Quick Prep', 'Vegetarian'],
    },
    {
        name: 'Mutton Rogan Josh',
        price: 280,
        quantity: '1 plate',
        category: '',
        description: 'Kashmiri style slow-cooked mutton in aromatic spices',
        stock: 30,
        image: 'https://images.unsplash.com/photo-1545247181-516773cae75a?w=400',
        highlights: ['Premium', 'Chef Special'],
        nutritionalInfo: {
            servingSize: '300g',
            calories: '450 kcal',
            protein: '30g',
        },
    },
    {
        name: 'Dal Tadka',
        price: 100,
        quantity: '1 bowl',
        category: '',
        description: 'Yellow lentils tempered with garlic, cumin and red chilies',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c4?w=400',
        highlights: ['Vegetarian', 'Healthy'],
        nutritionalInfo: {
            servingSize: '250g',
            calories: '180 kcal',
            protein: '10g',
        },
    },
    {
        name: 'Butter Naan',
        price: 35,
        quantity: '1 piece',
        category: '',
        description: 'Soft leavened bread brushed with butter',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        highlights: ['Fresh Baked', 'Popular'],
    },
    {
        name: 'Chicken Tikka',
        price: 200,
        quantity: '6 pieces',
        category: '',
        description: 'Marinated chicken chunks grilled to perfection',
        stock: 45,
        image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400',
        highlights: ['Grilled', 'Protein Rich'],
        nutritionalInfo: {
            servingSize: '200g',
            calories: '280 kcal',
            protein: '35g',
        },
    },
    {
        name: 'Malai Kofta',
        price: 170,
        quantity: '1 plate',
        category: '',
        description: 'Paneer and potato dumplings in rich creamy gravy',
        stock: 35,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
        highlights: ['Vegetarian', 'Creamy'],
    },
    {
        name: 'Tandoori Roti',
        price: 25,
        quantity: '1 piece',
        category: '',
        description: 'Whole wheat flatbread baked in tandoor',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
        highlights: ['Whole Wheat', 'Healthy'],
    },
    {
        name: 'Gulab Jamun (2 pcs)',
        price: 60,
        quantity: '1 serving',
        category: '',
        description: 'Deep-fried milk solids soaked in rose-flavored sugar syrup',
        stock: 50,
        image: 'https://images.unsplash.com/photo-16013035163-5f2e7c56e3a6?w=400',
        highlights: ['Sweet', 'Popular'],
    },
];

/**
 * Seed sample products for testing
 * This will create 10 sample menu items for the authenticated seller
 */
export const seedSampleProducts = async (): Promise<ApiResponse<Product>[]> => {
    // First get available categories
    const categoriesRes = await getCategories();
    if (!categoriesRes.success || !categoriesRes.data || categoriesRes.data.length === 0) {
        throw new Error('No categories found. Please create categories first.');
    }

    // Use the first category for all sample products (or distribute among available)
    const availableCategories = categoriesRes.data;
    const results: ApiResponse<Product>[] = [];

    for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
        const product = {
            ...SAMPLE_PRODUCTS[i],
            category: availableCategories[i % availableCategories.length]._id,
        };

        try {
            const result = await createProduct(product);
            results.push(result);
        } catch (error) {
            console.error(`Failed to create product ${product.name}:`, error);
        }
    }

    return results;
};

// ==================== Helper Functions ====================

/**
 * Get status display text
 */
export const getStatusDisplay = (status: Product['status']): { text: string; color: string } => {
    switch (status) {
        case 'approved':
            return { text: 'Approved', color: '#00C853' };
        case 'pending':
            return { text: 'Pending Approval', color: '#FFB300' };
        case 'rejected':
            return { text: 'Rejected', color: '#FF5252' };
        default:
            return { text: status, color: '#999' };
    }
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (price: number, discountPrice?: number): number | null => {
    if (!discountPrice || discountPrice >= price) return null;
    return Math.round(((price - discountPrice) / price) * 100);
};
