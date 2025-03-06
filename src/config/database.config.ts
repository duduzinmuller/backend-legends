import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

// Cria uma instância global do Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Exporta uma instância do PrismaClient para ser usada na aplicação
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

// Em ambientes de desenvolvimento, usamos uma conexão global para melhorar a performance
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Função para testar a conexão com o banco de dados
export const testDatabaseConnection = async (): Promise<boolean> => {
    try {
        // Executa uma query simples para testar a conexão
        await prisma.$queryRaw`SELECT 1`;
        logger.info("Conexão com o banco de dados estabelecida com sucesso.");
        return true;
    } catch (error) {
        logger.error("Erro ao conectar com o banco de dados:", error);
        return false;
    }
};

// Função para fechar a conexão com o banco de dados
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        logger.info("Desconectado do banco de dados.");
    } catch (error) {
        logger.error("Erro ao desconectar do banco de dados:", error);
        throw error;
    }
};

export default prisma;
