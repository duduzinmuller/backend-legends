import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { logger } from "../utils/logger";
import { appConfig } from "./app.config";

// Opções de configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Pagamentos",
            version: "1.0.0",
            description:
                "API para automação de pagamentos com Mercado Pago e notificações por e-mail",
            contact: {
                name: "Equipe de Desenvolvimento",
                email: "dev@example.com",
            },
        },
        servers: [
            {
                url: `${appConfig.webhookBaseUrl}${appConfig.apiPrefix}`,
                description: `Servidor ${appConfig.environment}`,
            },
        ],
        components: {
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        status: {
                            type: "string",
                            example: "error",
                        },
                        message: {
                            type: "string",
                            example: "Mensagem de erro",
                        },
                        details: {
                            type: "object",
                            example: {},
                        },
                    },
                },
                Customer: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
                        },
                        name: {
                            type: "string",
                            example: "João Silva",
                        },
                        email: {
                            type: "string",
                            example: "joao.silva@example.com",
                        },
                        phone: {
                            type: "string",
                            example: "+5511999999999",
                        },
                        document: {
                            type: "string",
                            example: "123.456.789-00",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Order: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
                        },
                        customerId: {
                            type: "string",
                            example: "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "PROCESSING",
                                "COMPLETED",
                                "CANCELLED",
                                "REFUNDED",
                            ],
                            example: "PENDING",
                        },
                        totalAmount: {
                            type: "number",
                            format: "float",
                            example: 199.99,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            example: "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
                        },
                        orderId: {
                            type: "string",
                            example: "c0a80121-7ac0-4e3b-9a9f-3a156f86a4d7",
                        },
                        externalId: {
                            type: "string",
                            example: "123456789",
                        },
                        status: {
                            type: "string",
                            enum: [
                                "PENDING",
                                "APPROVED",
                                "REJECTED",
                                "IN_PROCESS",
                                "IN_MEDIATION",
                                "CANCELLED",
                                "REFUNDED",
                                "CHARGED_BACK",
                            ],
                            example: "PENDING",
                        },
                        amount: {
                            type: "number",
                            format: "float",
                            example: 199.99,
                        },
                        paymentMethod: {
                            type: "string",
                            example: "credit_card",
                        },
                        paymentMethodId: {
                            type: "string",
                            example: "visa",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                        notificationSent: {
                            type: "boolean",
                            example: false,
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"], // Caminho para os arquivos com anotações JSDoc
};

// Gera a especificação do Swagger
export const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configura o Swagger na aplicação
export const setupSwagger = (app: Express): void => {
    try {
        // Rota para a documentação
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec, {
                customCss: ".swagger-ui .topbar { display: none }",
                customSiteTitle: "API de Pagamentos - Documentação",
            }),
        );

        // Rota para acessar a especificação em JSON
        app.get("/swagger.json", (req, res) => {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });

        logger.info("Swagger configurado com sucesso. Disponível em /api-docs");
    } catch (error) {
        logger.error("Erro ao configurar Swagger:", error);
    }
};

export default { swaggerSpec, setupSwagger };
