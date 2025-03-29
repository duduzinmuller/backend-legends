import { Order, OrderStatus, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderItemCreate } from "../models/orderItem.model";

const prisma = new PrismaClient();

export class OrderService {
    // Criação do pedido
    async createOrder(
        customerId: string,
        items: OrderItemCreate[],
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

        // Processar itens e calcular valor total
        const processedItems = [];
        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new Error(
                    `Produto com ID ${item.productId} não encontrado.`,
                );
            }

            // Usar o preço do produto se não for fornecido no item
            const unitPrice = item.unitPrice
                ? new Decimal(item.unitPrice)
                : new Decimal(product.price);
            totalAmount = totalAmount.add(unitPrice.mul(item.quantity));

            processedItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
            });
        }

        // Criar pedido com itens
        const order = await prisma.order.create({
            data: {
                customerId,
                status: "PENDING",
                totalAmount,
                items: {
                    create: processedItems,
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
            include: { items: true, customer: true },
        });
    }

    // Listar todos os pedidos com opções de paginação e filtros
    async listAll(
        options: {
            page?: number;
            pageSize?: number;
            status?: OrderStatus;
            customerId?: string;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
        } = {},
    ): Promise<{
        items: Order[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }> {
        const {
            page = 1,
            pageSize = 10,
            status,
            customerId,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * pageSize;

        // Construir o filtro de busca
        const where: { status?: OrderStatus; customerId?: string } = {};
        if (status) where.status = status;
        if (customerId) where.customerId = customerId;

        // Construir a ordenação
        const orderBy: Record<string, "asc" | "desc"> = {};
        orderBy[sortBy] = sortOrder;

        // Executar a consulta com contagem total
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: pageSize,
                orderBy,
                include: { items: true },
            }),
            prisma.order.count({ where }),
        ]);

        return {
            items: orders,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    // Atualizar o status do pedido
    async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
        return await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: true },
        });
    }

    // Cancelar pedido
    async cancel(id: string): Promise<Order | null> {
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new Error(`Pedido com ID ${id} não encontrado.`);
        }

        if (order.status === OrderStatus.COMPLETED) {
            throw new Error(
                "Não é possível cancelar um pedido já entregue ou concluído.",
            );
        }

        return await prisma.order.update({
            where: { id },
            data: { status: "CANCELLED" },
            include: { items: true },
        });
    }
}
