/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Router, Request, Response } from "express";
import { logger } from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Cria um novo pagamento para um pedido
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID do pedido a ser pago
 *     responses:
 *       200:
 *         description: Preferência de pagamento criada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 init_point:
 *                   type: string
 *                   description: URL para checkout do Mercado Pago
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro no servidor
 */
// @ts-expect-error
router.post(
    "/create",
    async (req: Request<{ orderId: string }>, res: Response) => {
        try {
            const { orderId } = req.body;

            if (!orderId) {
                return res.status(400).json({
                    status: "error",
                    message: "ID do pedido é obrigatório",
                });
            }

            logger.info(`Criando pagamento para o pedido: ${orderId}`);

            res.status(501).json({
                status: "error",
                message: "Criação de pagamento ainda não implementada",
            });
        } catch (error) {
            logger.error("Erro ao criar pagamento:", error);
            res.status(500).json({
                status: "error",
                message: "Erro ao processar requisição",
            });
        }
    },
);

/**
 * @swagger
 * /payments/success:
 *   get:
 *     summary: Callback para pagamento aprovado
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: collection_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: collection_status
 *         schema:
 *           type: string
 *       - in: query
 *         name: external_reference
 *         schema:
 *           type: string
 *       - in: query
 *         name: payment_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: payment_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: merchant_order_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecionamento após pagamento aprovado
 */
router.get("/success", (req: Request, res: Response) => {
    try {
        const { external_reference } = req.query;

        logger.info(
            `Callback de pagamento aprovado: ${JSON.stringify(req.query)}`,
        );

        // Aqui você redirecionaria para uma página de sucesso
        res.redirect(
            `${process.env.FRONTEND_URL || "/"}/payment/success?order=${external_reference}`,
        );
    } catch (error) {
        logger.error("Erro no callback de pagamento aprovado:", error);
        res.redirect(`${process.env.FRONTEND_URL || "/"}/payment/error`);
    }
});

/**
 * @swagger
 * /payments/failure:
 *   get:
 *     summary: Callback para pagamento rejeitado
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: collection_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: collection_status
 *         schema:
 *           type: string
 *       - in: query
 *         name: external_reference
 *         schema:
 *           type: string
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecionamento após pagamento rejeitado
 */
router.get("/failure", (req: Request, res: Response) => {
    try {
        logger.info(
            `Callback de pagamento rejeitado: ${JSON.stringify(req.query)}`,
        );

        // Aqui você redirecionaria para uma página de falha
        res.redirect(`${process.env.FRONTEND_URL || "/"}/payment/failure`);
    } catch (error) {
        logger.error("Erro no callback de pagamento rejeitado:", error);
        res.redirect(`${process.env.FRONTEND_URL || "/"}/payment/error`);
    }
});

/**
 * @swagger
 * /payments/pending:
 *   get:
 *     summary: Callback para pagamento pendente
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: collection_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: collection_status
 *         schema:
 *           type: string
 *       - in: query
 *         name: external_reference
 *         schema:
 *           type: string
 *       - in: query
 *         name: preference_id
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecionamento após pagamento pendente
 */
router.get("/pending", (req: Request, res: Response) => {
    try {
        logger.info(
            `Callback de pagamento pendente: ${JSON.stringify(req.query)}`,
        );

        // Aqui você redirecionaria para uma página de pagamento pendente
        res.redirect(`${process.env.FRONTEND_URL || "/"}/payment/pending`);
    } catch (error) {
        logger.error("Erro no callback de pagamento pendente:", error);
        res.redirect(`${process.env.FRONTEND_URL || "/"}/payment/error`);
    }
});

/**
 * @swagger
 * /payments/refund/{id}:
 *   post:
 *     summary: Solicita reembolso de um pagamento
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reembolso solicitado com sucesso
 *       400:
 *         description: Pagamento não pode ser reembolsado
 *       404:
 *         description: Pagamento não encontrado
 */
router.post("/refund/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Solicitando reembolso para pagamento: ${id}`);

        res.status(501).json({
            status: "error",
            message: "Reembolso ainda não implementado",
        });
    } catch (error) {
        logger.error(
            `Erro ao solicitar reembolso para pagamento ${req.params.id}:`,
            error,
        );
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Lista pagamentos
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: orderId
 *         schema:
 *           type: string
 *         description: Filtrar por pedido
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, IN_PROCESS, IN_MEDIATION, CANCELLED, REFUNDED, CHARGED_BACK]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de pagamentos
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { orderId, status } = req.query;
        logger.info(
            `Listando pagamentos. Filtros: ${JSON.stringify({ orderId, status })}`,
        );

        res.status(501).json({
            status: "error",
            message: "Listagem de pagamentos ainda não implementada",
        });
    } catch (error) {
        logger.error("Erro ao listar pagamentos:", error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Busca informações de um pagamento
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pagamento encontrado
 *       404:
 *         description: Pagamento não encontrado
 */
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        logger.info(`Buscando pagamento: ${id}`);

        res.status(501).json({
            status: "error",
            message: "Busca de pagamento ainda não implementada",
        });
    } catch (error) {
        logger.error(`Erro ao buscar pagamento ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

export const paymentRoutes = router;
