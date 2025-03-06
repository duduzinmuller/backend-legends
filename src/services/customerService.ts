import { Order, Customer } from "@prisma/client";
import { prisma } from "../utils/prisma";

interface CustomerServiceProps {
    id: string;
    email: string;
    name: string;
    phone?: string;
    orders: Order[];
}

export class CustomerServiceImpl {
    async execute({
        id,
        name,
        email,
        phone,
        orders,
    }: CustomerServiceProps): Promise<Customer> {
        try {
            const customer = await prisma.customer.create({
                data: {
                    id,
                    name,
                    email,
                    phone,
                    orders: {
                        create: orders.map((order) => ({
                            id: order.id,
                            status: order.status,
                            totalAmount: order.totalAmount,
                            createdAt: order.createdAt,
                        })),
                    },
                },
            });
            return customer;
        } catch (error) {
            console.error(error);
            throw new Error("Error creating customer");
        }
    }
}
