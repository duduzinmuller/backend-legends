import { Product } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import {
    ProductCreate,
    ProductUpdate,
    PaginationOptions,
    PaginatedResult,
} from "../models";
import { logger } from "../utils/logger";

export class ProductRepository extends BaseRepository<Product> {
    /**
     * Cria um novo produto
     */
    async create(data: ProductCreate): Promise<Product> {
        try {
            logger.debug("Creating product:", data);
            return await this.prisma.product.create({
                data,
            });
        } catch (error) {
            logger.error("Error creating product:", error);
            throw error;
        }
    }

    /**
     * Busca um produto pelo ID
     */
    async findById(id: string): Promise<Product | null> {
        try {
            return await this.prisma.product.findUnique({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error finding product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Atualiza um produto
     */
    async update(id: string, data: ProductUpdate): Promise<Product> {
        try {
            return await this.prisma.product.update({
                where: { id },
                data,
            });
        } catch (error) {
            logger.error(`Error updating product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Remove um produto
     */
    async delete(id: string): Promise<Product> {
        try {
            return await this.prisma.product.delete({
                where: { id },
            });
        } catch (error) {
            logger.error(`Error deleting product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Lista todos os produtos com paginação
     */
    async findAll(
        options: PaginationOptions,
    ): Promise<PaginatedResult<Product>> {
        try {
            const {
                page = 1,
                pageSize = 10,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = options;
            const skip = (page - 1) * pageSize;

            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    skip,
                    take: pageSize,
                    orderBy: {
                        [sortBy]: sortOrder,
                    },
                }),
                this.prisma.product.count(),
            ]);

            return this.paginate(products, total, options);
        } catch (error) {
            logger.error("Error finding all products:", error);
            throw error;
        }
    }

    /**
     * Busca produtos por nome (busca parcial)
     */
    async findByName(
        name: string,
        options: PaginationOptions,
    ): Promise<PaginatedResult<Product>> {
        try {
            const { page = 1, pageSize = 10 } = options;
            const skip = (page - 1) * pageSize;

            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive",
                        },
                    },
                    skip,
                    take: pageSize,
                }),
                this.prisma.product.count({
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive",
                        },
                    },
                }),
            ]);

            return this.paginate(products, total, options);
        } catch (error) {
            logger.error(`Error finding products by name "${name}":`, error);
            throw error;
        }
    }

    /**
     * Busca produtos por IDs
     */
    async findByIds(ids: string[]): Promise<Product[]> {
        try {
            return await this.prisma.product.findMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
            });
        } catch (error) {
            logger.error(`Error finding products by IDs ${ids}:`, error);
            throw error;
        }
    }
}
