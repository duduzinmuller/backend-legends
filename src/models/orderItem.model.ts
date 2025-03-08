import { OrderItem } from "@prisma/client";

export type OrderItemCreate = {
    productId: string;
    quantity: number;
    price?: number; // Optional as it might be fetched from the product
};

export { OrderItem };
