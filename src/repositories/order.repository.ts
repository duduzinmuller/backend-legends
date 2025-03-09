import { Order, OrderStatus, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import {
    OrderCreate,
    OrderUpdate,
    PaginationOptions,
    PaginatedResult,
} from "../models";
import { logger } from "../utils/logger";

export class OrderRepository extends BaseRepository<Order> {
    /**
     * Cria um novo pedido com itens
     */
    async create(data: OrderCreate): Promise<Order> {
        try {
            logger.debug("Creating order:", data);

            // Usando transaction para garantir que todos os itens sejam criados junto com o pedido
            return await this.prisma.$transaction(async (prisma) => {
                // Primeiro, criamos o pedido
                const order = await prisma.order.create({
                    data: {
                        customerId: data.customerId,
                        status: data.status || "PENDING",
                        totalAmount: new Prisma.Decimal(0), // Será atualizado depois de adicionar os itens
                    },
                });

                // Em seguida, criamos os itens e calculamos o total
                let totalAmount = new Prisma.Decimal(0);

                for (const item of data.items) {
                    // Se o preço não for fornecido, busca do produto
                    let price = item.price;
                    if (!price) {
                        const product = await prisma.product.findUnique({
                            where: { id: item.productId },
                        });

                        if (!product) {
                            throw new Error(
                                `Product with ID ${item.productId} not found`,
                            );
                        }

                        price = product.price.toNumber();
                    }

                    // Cria o item
                    await prisma.orderItem.create({
                        data: {
                            orderId: order.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: new Prisma.Decimal(price),
                        },
                    });

                    // Atualiza o total
                    totalAmount = totalAmount.plus(
                        new Prisma.Decimal(price * item.quantity),
                    );
                }

                // Atualiza o pedido com o total
                return await prisma.order.update({
                    where: { id: order.id },
                    data: { totalAmount },
                });
            });
        } catch (error) {
            logger.error("Error creating order:", error);
            throw error;
        }
    }

    /**
     * Busca um pedido pelo ID com itens e cliente
     */
    async findById(id: string): Promise<Order | null> {
        try {
            return await this.prisma.order.findUnique({
                where: { id },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    payments: true,
                },
            });
        } catch (error) {
            logger.error(`Error finding order with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza um pedido
     */
    async update(id: string, data: OrderUpdate): Promise<Order> {
        try {
            return await this.prisma.order.update({
                where: { id },
                data,
            });
        } catch (error) {
            logger.error(`Error updating order with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove um pedido e seus itens (usando cascade)
     */
    async delete(id: string): Promise<Order> {
        try {
            return await this.prisma.order.delete({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error deleting order with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Lista todos os pedidos com paginação
     */
    async findAll(options: PaginationOptions): Promise<PaginatedResult<Order>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [orders, total] = await Promise.all([
                this.prisma.order.findMany({
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    include: {
                        customer: true,
                        payments: true,
                    },
                }),
                this.prisma.order.count(),
            ]);

            return this.paginate(orders, total, options);
        } catch (error) {
            logger.error("Error finding all orders:", error);
            throw error;
        }
    }

    /**
     * Busca pedidos por cliente
     */
    async findByCustomer(
        customerId: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<Order>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [orders, total] = await Promise.all([
                this.prisma.order.findMany({
                    where: { customerId },
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    include: {
                        customer: true,
                        payments: true,
                    },
                }),
                this.prisma.order.count({
                    where: { customerId },
                }),
            ]);

            return this.paginate(orders, total, options);
        } catch (error) {
            logger.error(
                `Error finding orders for customer ${customerId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Busca pedidos por status
     */
    async findByStatus(
        status: OrderStatus,
        options: PaginationOptions,
    ): Promise<PaginatedResult<Order>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [orders, total] = await Promise.all([
                this.prisma.order.findMany({
                    where: { status },
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    include: {
                        customer: true,
                        payments: true,
                    },
                }),
                this.prisma.order.count({
                    where: { status },
                }),
            ]);

            return this.paginate(orders, total, options);
        } catch (error) {
            logger.error(`Error finding orders with status ${status}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza o status de um pedido
     */
    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        try {
            return await this.prisma.order.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            logger.error(`Error updating status for order ${id}:`, error);
            throw error;
        }
    }
}
