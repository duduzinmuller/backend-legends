import NodeCache from "node-cache";
import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

// Instância principal do cache
const cache = new NodeCache({
    stdTTL: Number(process.env.CACHE_DEFAULT_TTL) || 300, // 5 minutos padrão
    checkperiod: 60, // verifica expiração a cada 1 minuto
    useClones: false, // para melhor desempenho com objetos grandes
});

/**
 * Middleware para caching de rotas GET
 * @param ttl Tempo de vida do cache em segundos
 */
export const cacheMiddleware = (ttl = 300) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Só aplicamos cache para requisições GET
        if (req.method !== "GET") {
            return next();
        }

        // Montamos a chave do cache
        const key = generateCacheKey(req);
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            logger.debug(`Cache hit: ${key}`);
            return res.json(cachedResponse);
        }

        logger.debug(`Cache miss: ${key}`);

        // Interceptamos o método json para armazenar o resultado no cache
        const originalJson = res.json;
        res.json = function (body: unknown) {
            cache.set(key, body, ttl);
            return originalJson.call(this, body);
        };

        next();
    };
};

/**
 * Gera uma chave de cache com base na rota e parâmetros da requisição
 */
const generateCacheKey = (req: Request): string => {
    const baseUrl = req.originalUrl || req.url;

    // Se houver um ID de usuário autenticado, incluímos na chave para cache por usuário
    interface AuthenticatedRequest extends Request {
        user?: { id: string };
    }

    const userId = (req as AuthenticatedRequest).user?.id || "anonymous";

    return `${userId}:${baseUrl}`;
};

/**
 * Limpa cache com prefixo específico
 * @param prefix Prefixo da chave a ser removida
 */
export const invalidateCacheByPrefix = (prefix: string): void => {
    const keys = cache.keys().filter((key) => key.startsWith(prefix));

    if (keys.length > 0) {
        logger.debug(
            `Invalidating ${keys.length} cache keys with prefix: ${prefix}`,
        );
        keys.forEach((key) => cache.del(key));
    }
};

/**
 * Limpa cache para recursos específicos (por exemplo, ao fazer um CRUD)
 * @param resourceType Tipo de recurso (ex: 'customer', 'payment')
 * @param id ID do recurso (opcional)
 */
export const invalidateResourceCache = (
    resourceType: string,
    id?: string,
): void => {
    const prefix = id ? `${resourceType}:${id}` : resourceType;
    invalidateCacheByPrefix(prefix);
};

/**
 * Recupera ou define um item no cache
 * @param key Chave para o item
 * @param ttl Tempo de vida em segundos
 * @param storeFunction Função que gera o valor a ser cacheado
 */
export const getOrSet = async <T>(
    key: string,
    ttl: number,
    storeFunction: () => Promise<T>,
): Promise<T> => {
    const value = cache.get<T>(key);

    if (value !== undefined) {
        logger.debug(`Cache hit for key: ${key}`);
        return value;
    }

    logger.debug(`Cache miss for key: ${key}, fetching data...`);
    try {
        const result = await storeFunction();
        cache.set(key, result, ttl);
        return result;
    } catch (error) {
        logger.error(`Error fetching data for cache key ${key}:`, error);
        throw error;
    }
};

// Exporta a instância do cache para uso direto
export { cache };
