import { PrismaClient } from "@prisma/client";
import { PaginationOptions, PaginatedResult } from "../models";
import prisma from "./prisma.client";

export abstract class BaseRepository<T> {
    protected prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    /**
     * Métodos genéricos que devem ser implementados pelas classes filhas
     */
    abstract create(data: unknown): Promise<T>;
    abstract findById(id: string): Promise<T | null>;
    abstract update(id: string, data: unknown): Promise<T>;
    abstract delete(id: string): Promise<T>;

    /**
     * Método básico para paginação que pode ser implementado pelas classes filhas
     */
    protected async paginate<T>(
        items: T[],
        total: number,
        options: PaginationOptions,
    ): Promise<PaginatedResult<T>> {
        const page = options.page || 1;
        const pageSize = options.pageSize || 10;

        return {
            items,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
}
