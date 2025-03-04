import { Order } from "@prisma/client";
import { prisma } from "../utils/prisma";
interface CustomerServiceProps {
    id: string;
    email: string;
    name: string;
    phone?: string;
    orders: Order[];
}

export const CustomerService = async ({
    id,
    name,
    email,
    phone,
    orders,
}: CustomerServiceProps) => {
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
                        createdAt: order.updatedAt,
                    })),
                },
            },
        });
        return customer;
    } catch (error) {
        console.error(error);
    }
};
