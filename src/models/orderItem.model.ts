import { OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type OrderItemCreate = {
    productId: string;
    quantity: number;
    unitPrice?: number | Decimal; // Alterado de price para unitPrice para corresponder ao modelo do Prisma
};

export { OrderItem };
