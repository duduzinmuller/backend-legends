import { Customer } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import {
    CustomerCreate,
    CustomerUpdate,
    PaginationOptions,
    PaginatedResult,
} from "../models";
import { logger } from "../utils/logger";

export class CustomerRepository extends BaseRepository<Customer> {
    /**
     * Cria um novo cliente
     */
    async create(data: CustomerCreate): Promise<Customer> {
        try {
            logger.debug("Creating customer:", data);
            return await this.prisma.customer.create({
                data,
            });
        } catch (error) {
            logger.error("Error creating customer:", error);
            throw error;
        }
    }

    /**
     * Busca um cliente pelo ID
     */
    async findById(id: string): Promise<Customer | null> {
        try {
            return await this.prisma.customer.findUnique({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error finding customer with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca um cliente pelo email
     */
    async findByEmail(email: string): Promise<Customer | null> {
        try {
            return await this.prisma.customer.findUnique({
                where: { email },
            });
        } catch (error) {
            logger.error(`Error finding customer with email ${email}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza um cliente
     */
    async update(id: string, data: CustomerUpdate): Promise<Customer> {
        try {
            return await this.prisma.customer.update({
                where: { id },
                data,
            });
        } catch (error) {
            logger.error(`Error updating customer with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove um cliente
     */
    async delete(id: string): Promise<Customer> {
        try {
            return await this.prisma.customer.delete({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error deleting customer with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Lista todos os clientes com paginação
     */
    async findAll(
        options: PaginationOptions,
    ): Promise<PaginatedResult<Customer>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [customers, total] = await Promise.all([
                this.prisma.customer.findMany({
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                }),
                this.prisma.customer.count(),
            ]);

            return this.paginate(customers, total, options);
        } catch (error) {
            logger.error("Error finding all customers:", error);
            throw error;
        }
    }

    /**
     * Busca clientes por nome (busca parcial)
     */
    async findByName(
        name: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<Customer>> {
        try {
            const { page = 1, pageSize = 10 } = options;
            const skip = (page - 1) * pageSize;

            const [customers, total] = await Promise.all([
                this.prisma.customer.findMany({
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive",
                        },
                    },
                    skip,
                    take: pageSize,
                }),
                this.prisma.customer.count({
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive",
                        },
                    },
                }),
            ]);

            return this.paginate(customers, total, options);
        } catch (error) {
            logger.error(`Error finding customers by name "${name}":`, error);
            throw error;
        }
    }
}
