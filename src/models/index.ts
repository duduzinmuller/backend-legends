// Customer
export * from "./customer.model";

// Product
export * from "./product.model";

// Order
export * from "./order.model";
export * from "./orderItem.model";

// Payment
export * from "./payment.model";

// Response types
export interface ApiResponse<T = unknown> {
    status: "success" | "error";
    message?: string;
    data?: T;
    error?: {
        code?: string;
        details?: Record<string, unknown>;
    };
}

// Pagination
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface PaginationOptions {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
