import { Request, Response, NextFunction } from "express";

// Interface para erros personalizados
export interface ApiError extends Error {
    statusCode?: number;
    details?: unknown;
}

/**
 * Middleware global para tratamento de erros
 */
export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Erro interno do servidor";

    // Log do erro
    console.error(`${statusCode} - ${message}`, {
        method: req.method,
        path: req.path,
        error: err.stack,
        body: req.body,
    });

    // Resposta de erro
    res.status(statusCode).json({
        status: "error",
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        ...(typeof err.details === "object" &&
            err.details !== null && { details: err.details }),
    });
};

/**
 * Classe utilitária para criar erros com status code
 */
export class AppError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(message: string, statusCode: number, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
