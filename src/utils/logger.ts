import winston from "winston";
import { format } from "date-fns-tz";

const { combine, printf, colorize } = winston.format;

// Função para formatar a data no padrão brasileiro
const formatToBrazilianDateTime = () => {
    return {
        transform: (info: winston.Logform.TransformableInfo) => {
            const brazilianTime = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
                timeZone: "America/Sao_Paulo",
            });
            info.timestamp = brazilianTime;
            return info;
        },
    };
};

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(formatToBrazilianDateTime(), logFormat),
    transports: [
        new winston.transports.Console({
            format: combine(colorize(), formatToBrazilianDateTime(), logFormat),
        }),
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

// Se não estiver em produção, adiciona logs mais detalhados
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), formatToBrazilianDateTime(), logFormat),
        }),
    );
}
