import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

// Evita criar múltiplas instâncias do Prisma Client no modo de desenvolvimento com Hot Reload
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
    const prisma = new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

    // Adiciona middleware de log para todas as queries
    prisma.$use(async (params, next) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();

        logger.debug(
            `Prisma Query: ${params.model}.${params.action} - ${after - before}ms`,
        );

        return result;
    });

    return prisma;
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
