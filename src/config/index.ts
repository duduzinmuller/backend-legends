import { configMercadoPago } from "./mercadopago.config";
import { testDatabaseConnection } from "./database.config";
import { logger } from "../utils/logger";

/**
 * Inicializa todas as configurações da aplicação
 */
export const initializeConfigs = async (): Promise<void> => {
    try {
        logger.info("Inicializando configurações da aplicação...");

        // Testa a conexão com o banco de dados
        const dbConnected = await testDatabaseConnection();
        if (!dbConnected) {
            throw new Error("Não foi possível conectar ao banco de dados");
        }

        // Configura o Mercado Pago
        configMercadoPago();

        logger.info("Todas as configurações inicializadas com sucesso");
    } catch (error) {
        logger.error("Erro ao inicializar configurações:", error);
        throw error;
    }
};

// Exportações
export * from "./app.config";
export * from "./database.config";
export * from "./email.config";
export * from "./mercadopago.config";
export * from "./swagger.config";
