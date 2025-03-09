import { Payment, PaymentStatus, Prisma } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { PaginationOptions, PaginatedResult } from "../models";
import { logger } from "../utils/logger";

export class PaymentRepository extends BaseRepository<Payment> {
    /**
     * Cria um novo pagamento
     */
    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        try {
            logger.debug("Creating payment:", data);

            // Convertendo amount para Decimal caso seja um número
            const amount =
                typeof data.amount === "number"
                    ? new Prisma.Decimal(data.amount)
                    : data.amount;

            // Criando o objeto de dados compatível com o Prisma
            const createData: Prisma.PaymentCreateInput = {
                order: { connect: { id: data.order?.connect?.id || "" } },
                externalId: data.externalId,
                status: (data.status as PaymentStatus) || "PENDING",
                amount,
                paymentMethod: data.paymentMethod,
                paymentProvider: "MERCADO_PAGO", // Valor padrão ou pode ser passado via data
                paymentUrl: null, // Pode ser atualizado posteriormente
                transactionDetails:
                    (data.transactionDetails as Prisma.JsonObject) || {},
            };

            return await this.prisma.payment.create({
                data: createData,
            });
        } catch (error) {
            logger.error("Error creating payment:", error);
            throw error;
        }
    }

    /**
     * Busca um pagamento pelo ID
     */
    async findById(id: string): Promise<Payment | null> {
        try {
            return await this.prisma.payment.findUnique({
                where: { id },
                include: {
                    order: {
                        include: {
                            customer: true,
                        },
                    },
                },
            });
        } catch (error) {
            logger.error(`Error finding payment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca um pagamento pelo ID externo (Mercado Pago)
     */
    async findByExternalId(externalId: string): Promise<Payment | null> {
        try {
            return await this.prisma.payment.findFirst({
                where: { externalId },
                include: {
                    order: {
                        include: {
                            customer: true,
                        },
                    },
                },
            });
        } catch (error) {
            logger.error(
                `Error finding payment with external ID ${externalId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Atualiza um pagamento
     */
    async update(
        id: string,
        data: Prisma.PaymentUpdateInput,
    ): Promise<Payment> {
        try {
            // Convertendo transactionDetails para JsonObject se necessário
            const updateData: Prisma.PaymentUpdateInput = { ...data };

            return await this.prisma.payment.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            logger.error(`Error updating payment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove um pagamento
     */
    async delete(id: string): Promise<Payment> {
        try {
            return await this.prisma.payment.delete({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error deleting payment with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Lista todos os pagamentos com paginação
     */
    async findAll(
        options: PaginationOptions,
    ): Promise<PaginatedResult<Payment>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [payments, total] = await Promise.all([
                this.prisma.payment.findMany({
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    include: {
                        order: {
                            include: {
                                customer: true,
                            },
                        },
                    },
                }),
                this.prisma.payment.count(),
            ]);

            return this.paginate(payments, total, options);
        } catch (error) {
            logger.error("Error finding all payments:", error);
            throw error;
        }
    }

    /**
     * Busca pagamentos por ordem
     */
    async findByOrder(orderId: string): Promise<Payment[]> {
        try {
            return await this.prisma.payment.findMany({
                where: { order: { id: orderId } },
                include: {
                    order: {
                        include: {
                            customer: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            logger.error(`Error finding payments for order ${orderId}:`, error);
            throw error;
        }
    }

    /**
     * Busca pagamentos por status
     */
    async findByStatus(
        status: PaymentStatus,
        options: PaginationOptions,
    ): Promise<PaginatedResult<Payment>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [payments, total] = await Promise.all([
                this.prisma.payment.findMany({
                    where: { status },
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                    include: {
                        order: {
                            include: {
                                customer: true,
                            },
                        },
                    },
                }),
                this.prisma.payment.count({
                    where: { status },
                }),
            ]);

            return this.paginate(payments, total, options);
        } catch (error) {
            logger.error(
                `Error finding payments with status ${status}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Atualiza o status de um pagamento
     */
    async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
        try {
            return await this.prisma.payment.update({
                where: { id },
                data: { status },
            });
        } catch (error) {
            logger.error(`Error updating status for payment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Marca um pagamento como notificado
     * Este método atualiza um campo na aplicação que não existe no banco
     * Utilizamos uma solução alternativa
     */
    async markAsNotified(id: string): Promise<Payment> {
        try {
            // Como 'notificationSent' não existe no schema, vamos usar transactionDetails
            const payment = await this.prisma.payment.findUnique({
                where: { id },
            });

            if (!payment) {
                throw new Error(`Payment with ID ${id} not found`);
            }

            // Extrai os detalhes da transação existentes
            const transactionDetails =
                (payment.transactionDetails as Prisma.JsonObject) || {};

            // Adiciona a informação de notificação
            const updatedDetails = {
                ...transactionDetails,
                notificationSent: true,
                notificationDate: new Date().toISOString(),
            };

            // Atualiza o pagamento
            return await this.prisma.payment.update({
                where: { id },
                data: {
                    transactionDetails: updatedDetails as Prisma.JsonObject,
                },
            });
        } catch (error) {
            logger.error(`Error marking payment ${id} as notified:`, error);
            throw error;
        }
    }
}
