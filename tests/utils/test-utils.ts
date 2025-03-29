import { Request, Response } from "express";

/**
 * Cria um objeto mock de Request do Express para testes
 */
export const mockRequest = (options: Partial<Request> = {}): Request => {
    const req = {} as Request;

    // Valores padrão
    req.body = {};
    req.params = {};
    req.query = {};
    req.headers = {};

    // Sobrescrever com opções passadas
    Object.assign(req, options);

    return req;
};

/**
 * Cria um objeto mock de Response do Express para testes
 */
export const mockResponse = (): Response => {
    const res = {} as Response;

    // Mock das funções de resposta
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.redirect = jest.fn().mockReturnThis();
    res.sendStatus = jest.fn().mockReturnThis();
    res.setHeader = jest.fn().mockReturnThis();

    return res;
};

/**
 * Gera um ID aleatório no formato UUID para testes
 */
export const generateTestId = (): string => {
    return "test-id-" + Math.random().toString(36).substring(2, 15);
};

/**
 * Cria um delay para testes assíncronos
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
