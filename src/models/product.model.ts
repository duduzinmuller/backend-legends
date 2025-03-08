import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type ProductCreate = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type ProductUpdate = Partial<ProductCreate>;

// Helper for converting price to Decimal
export const toDecimal = (price: number): Decimal => {
    return new Decimal(price);
};

export { Product };
