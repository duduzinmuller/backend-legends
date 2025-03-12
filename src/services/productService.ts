import { OrderItem, Product } from "@prisma/client";
import { prisma } from "../utils/prisma";

interface ProductServiceProps {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    active: boolean;
    orderItems: OrderItem[];
}

export class ProductService {
    async execute({
        name,
        description,
        price,
        imageUrl,
        active,
        orderItems,
    }: ProductServiceProps): Promise<Product> {
        try {
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    imageUrl,
                    active,
                    orderItems: {
                        create: orderItems.map((orderItem) => ({
                            id: orderItem.id,
                            orderId: orderItem.orderId,
                            quantity: orderItem.quantity,
                            unitPrice: orderItem.unitPrice,
                            createdAt: orderItem.createdAt,
                            updatedAt: orderItem.updatedAt,
                        })),
                    },
                },
            });
            return product;
        } catch (error) {
            console.error(error);
            throw new Error("Error creating customer");
        }
    }
}
