import winston from "winston";
import moment from "moment-timezone";

const { combine, printf, colorize } = winston.format;

// Função para formatar a data no padrão brasileiro
const formatToBrazilianDateTime = () => {
    return {
        transform: (info: winston.Logform.TransformableInfo) => {
            // Usa moment-timezone para obter a hora no fuso horário de São Paulo
            const brazilianTime = moment()
                .tz("America/Sao_Paulo")
                .format("DD/MM/YYYY HH:mm:ss");
            info.timestamp = brazilianTime;
            return info;
        },
    };
};

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configuração do logger
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        formatToBrazilianDateTime(), // Adiciona o timestamp no formato brasileiro
        logFormat, // Define o formato do log
    ),
    transports: [
        // Console transport com colorização para facilitar a leitura
        new winston.transports.Console({
            format: combine(colorize(), logFormat), // Simplificado para evitar redundância
        }),
        // Transport para logs de erro
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        // Transport para logs gerais
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

// Se não estiver em produção, adiciona logs mais detalhados na console
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), logFormat),
        }),
    );
}
