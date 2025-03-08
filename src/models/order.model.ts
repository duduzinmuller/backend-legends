import { Order, OrderStatus } from "@prisma/client";
import { OrderItemCreate } from "./orderItem.model";

export type OrderCreate = {
    customerId: string;
    items: OrderItemCreate[];
    status?: OrderStatus;
};

export type OrderUpdate = {
    status?: OrderStatus;
};

export { Order, OrderStatus };
