// Configuração global para testes Jest

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = "test";
process.env.PORT = "9000";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test-db";
process.env.MERCADOPAGO_ACCESS_TOKEN =
    "TEST-0000000000000000-000000-00000000000000000000000000000000-000000000";
process.env.RESEND_API_KEY = "test_api_key";
process.env.WEBHOOK_BASE_URL = "http://localhost:9000";
process.env.CACHE_DEFAULT_TTL = "60";

// Mock dos módulos globais
jest.mock("../src/utils/logger", () => ({
    logger: {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

// Limpeza após os testes
afterAll(async () => {
    jest.resetAllMocks();
});
