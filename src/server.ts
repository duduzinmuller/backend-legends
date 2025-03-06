import "dotenv/config";
import app from "./app";

// Configuração da porta
const PORT = process.env.PORT || 8000;

// Inicialização do servidor
const server = app.listen(PORT, () => {
    console.log(
        `Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || "development"}`,
    );
});

// Tratamento de exceções não tratadas
process.on("uncaughtException", (error) => {
    console.error("Exceção não tratada:", error);
    process.exit(1);
});

// Tratamento de rejeições não tratadas
process.on("unhandledRejection", (error) => {
    console.error("Rejeição não tratada:", error);
    server.close(() => {
        process.exit(1);
    });
});

// Tratamento de sinais de interrupção
process.on("SIGTERM", () => {
    console.info("SIGTERM recebido. Desligando graciosamente.");
    server.close(() => {
        console.info("Servidor encerrado.");
    });
});

export default server;
