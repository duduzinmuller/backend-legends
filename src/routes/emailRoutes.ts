import { Router, Request, Response, NextFunction } from "express";
import { EmailController } from "../controllers/emailController";

// Tipo explicitamente definido para a função assíncrona
const asyncHandler =
    (
        fn: (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => Promise<Response>,
    ) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

/**
 * @swagger
 * /emails/payment-confirmation:
 *   post:
 *     summary: Envia um email de confirmação de pagamento
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - orderNumber
 *               - amount
 *               - paymentDate
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: "João Silva"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 description: Email do cliente
 *                 example: "joao@exemplo.com"
 *               orderNumber:
 *                 type: string
 *                 description: Número do pedido
 *                 example: "ORD-12345"
 *               amount:
 *                 type: string
 *                 description: Valor total do pedido
 *                 example: "R$ 199,90"
 *               paymentDate:
 *                 type: string
 *                 description: Data do pagamento
 *                 example: "22/03/2025"
 *               items:
 *                 type: array
 *                 description: Itens do pedido
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nome do produto
 *                       example: "Smartphone XYZ"
 *                     quantity:
 *                       type: number
 *                       description:
 *                       example: 1
 *                     price:
 *                       type: number
 *                       description: Preço unitário
 *                       example: 199.9
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao enviar o email
 */

/**
 * @swagger
 * /emails/payment-failed:
 *   post:
 *     summary: Envia um email de falha no pagamento
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - orderNumber
 *               - errorMessage
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: "João Silva"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 description: Email do cliente
 *                 example: "joao@exemplo.com"
 *               orderNumber:
 *                 type: string
 *                 description: Número do pedido
 *                 example: "ORD-12345"
 *               errorMessage:
 *                 type: string
 *                 description: Descrição do erro no pagamento
 *                 example: "Cartão de crédito recusado"
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao enviar o email
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.post("/payment-failed", asyncHandler(EmailController.sendPaymentFailed));

/**
 * @swagger
 * /emails/welcome:
 *   post:
 *     summary: Envia um email de boas-vindas para um novo cliente
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Nome do cliente
 *                 example: "João Silva"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 description: Email do cliente
 *                 example: "joao@exemplo.com"
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro ao enviar o email
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.post("/welcome", asyncHandler(EmailController.sendWelcome));

export const emailRoutes = router;
