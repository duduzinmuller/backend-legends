import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { customerControllerRouter } from "./routes/customerRoutes";
import { errorHandler } from "./middlewares/error.middleware";
import { emailRoutes } from "./routes/emailRoutes";
import { orderRoutes } from "./routes/orderRoutes";

// Inicialização da aplicação Express
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Rota de health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", timestamp: new Date() });
});

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de Pagamentos",
            version: "1.0.0",
            description:
                "API para automação de pagamentos com Mercado Pago e notificações por e-mail",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8000}`,
                description: "Servidor de desenvolvimento",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rotas da API
app.use("/api/customers", customerControllerRouter);
// Adicionar outras rotas quando estiverem disponíveis
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/send-email", emailRoutes);

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
    res.status(404).json({
        error: `Rota ${req.originalUrl} não encontrada`,
    });
});

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
