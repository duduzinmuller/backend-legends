/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, Order, OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export class OrderService {
    // Criação do pedido
    async createOrder(
        customerId: string,
        items: { productId: string; quantity: number }[],
    ): Promise<Order> {
        if (!customerId || items.length === 0) {
            throw new Error("Cliente e itens são obrigatórios.");
        }

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            throw new Error("Cliente não encontrado.");
        }

        let totalAmount = new Decimal(0);

        const orderItems: OrderItem[] = [];
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new Error(
                    `Produto com ID ${item.productId} não encontrado.`,
                );
            }

            const price = new Decimal(product.price);
            totalAmount = totalAmount.add(price.mul(item.quantity));

            orderItems.push({
                id: "",
                orderId: "",
                productId: item.productId,
                quantity: item.quantity,
                price,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        const order = await prisma.order.create({
            data: {
                customerId,
                status: "PENDING",
                totalAmount,
                items: {
                    create: orderItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { items: true },
        });

        return order;
    }

    // Buscar pedido por ID
    async findById(id: string): Promise<Order | null> {
        return await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
    }

    // Listar todos os pedidos
    async listAll(query: any): Promise<Order[]> {
        // Aqui, você pode aplicar filtros de query se necessário (por exemplo, status)
        return await prisma.order.findMany({
            where: {
                // Adicione condições de filtro se necessário
            },
            include: { items: true },
        });
    }

    // Atualizar o status do pedido
    async updateStatus(id: string, status: string): Promise<Order | null> {
        return await prisma.order.update({
            where: { id },
            data: { status: "REFUNDED" },
            include: { items: true },
        });
    }

    // Cancelar pedido
    async cancel(id: string): Promise<Order | null> {
        return await prisma.order.update({
            where: { id },
            data: { status: "CANCELLED" },
            include: { items: true },
        });
    }
}
