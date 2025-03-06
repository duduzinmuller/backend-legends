import { logger } from "../utils/logger";

/**
 * Configurações globais da aplicação
 */
export interface AppConfig {
    environment: string;
    port: number;
    apiPrefix: string;
    webhookBaseUrl: string;
    rateLimit: {
        windowMs: number;
        max: number;
    };
    cache: {
        defaultTTL: number; // em segundos
    };
}

/**
 * Carrega as configurações da aplicação a partir de variáveis de ambiente
 */
export const loadAppConfig = (): AppConfig => {
    // Define configurações padrão
    const defaultConfig: AppConfig = {
        environment: "development",
        port: 8000,
        apiPrefix: "/api",
        webhookBaseUrl: "http://localhost:8000",
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutos
            max: 100, // limite por IP
        },
        cache: {
            defaultTTL: 300, // 5 minutos
        },
    };

    try {
        // Carrega configurações das variáveis de ambiente
        const config: AppConfig = {
            environment: process.env.NODE_ENV || defaultConfig.environment,
            port: parseInt(process.env.PORT || String(defaultConfig.port), 10),
            apiPrefix: process.env.API_PREFIX || defaultConfig.apiPrefix,
            webhookBaseUrl:
                process.env.WEBHOOK_BASE_URL || defaultConfig.webhookBaseUrl,
            rateLimit: {
                windowMs: parseInt(
                    process.env.RATE_LIMIT_WINDOW_MS ||
                        String(defaultConfig.rateLimit.windowMs),
                    10,
                ),
                max: parseInt(
                    process.env.RATE_LIMIT_MAX ||
                        String(defaultConfig.rateLimit.max),
                    10,
                ),
            },
            cache: {
                defaultTTL: parseInt(
                    process.env.CACHE_DEFAULT_TTL ||
                        String(defaultConfig.cache.defaultTTL),
                    10,
                ),
            },
        };

        logger.info(
            `Configurações da aplicação carregadas para ambiente: ${config.environment}`,
        );
        return config;
    } catch (error) {
        logger.error("Erro ao carregar configurações da aplicação:", error);
        return defaultConfig;
    }
};

// Exporta as configurações carregadas
export const appConfig = loadAppConfig();

export default appConfig;
