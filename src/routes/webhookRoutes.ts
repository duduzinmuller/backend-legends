import express, { Request, Response } from "express";
import { logger } from "../utils/logger";

const router = express.Router();

/**
 * @swagger
 * /webhooks/mercadopago:
 *   post:
 *     summary: Webhook para notificações do Mercado Pago
 *     tags: [Webhooks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *               api_version:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *               date_created:
 *                 type: string
 *               id:
 *                 type: number
 *               live_mode:
 *                 type: boolean
 *               type:
 *                 type: string
 *               user_id:
 *                 type: number
 *     responses:
 *       200:
 *         description: Notificação processada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/mercadopago", async (req: Request, res: Response) => {
    try {
        logger.info(
            `Webhook do Mercado Pago recebido: ${JSON.stringify(req.body)}`,
        );

        const { type, data } = req.body;

        if (type === "payment") {
            const paymentId = data.id;
            logger.info(
                `Processando notificação de pagamento ID: ${paymentId}`,
            );

            // TODO: Implementar processamento da notificação de pagamento
            // 1. Buscar detalhes do pagamento na API do Mercado Pago
            // 2. Atualizar status do pagamento no banco de dados
            // 3. Atualizar status do pedido
            // 4. Enviar email de confirmação ao cliente
        }

        // Sempre responder com 200 para o Mercado Pago
        res.status(200).json({ status: "success" });
    } catch (error) {
        logger.error("Erro ao processar webhook do Mercado Pago:", error);
        // Ainda retornamos 200 para o Mercado Pago não tentar novamente
        res.status(200).json({ status: "error", message: "Erro processado" });
    }
});

export const webhookRoutes = router;
