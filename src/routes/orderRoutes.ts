import express from "express";
import { OrderController } from "../controllers/orderController";
import { logger } from "../utils/logger";

const router = express.Router();
const orderController = new OrderController();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente ou produto não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.post("/", async (req, res) => {
    try {
        await orderController.createOrder(req, res);
    } catch (error) {
        logger.error("Erro ao criar pedido:", error);
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor",
        });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", async (req, res) => {
    try {
        await orderController.getOrderById(req, res);
    } catch (error) {
        logger.error(`Erro ao buscar pedido ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor",
        });
    }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema:
 *           type: string
 *         description: Filtrar por cliente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", async (req, res) => {
    try {
        await orderController.listOrders(req, res);
    } catch (error) {
        logger.error("Erro ao listar pedidos:", error);
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor",
        });
    }
});

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PROCESSING, COMPLETED, CANCELLED, REFUNDED]
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       400:
 *         description: Status inválido
 *       404:
 *         description: Pedido não encontrado
 */
router.patch("/:id/status", async (req, res) => {
    try {
        await orderController.updateOrderStatus(req, res);
    } catch (error) {
        logger.error(
            `Erro ao atualizar status do pedido ${req.params.id}:`,
            error,
        );
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor",
        });
    }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Cancela um pedido
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido cancelado com sucesso
 *       400:
 *         description: Pedido não pode ser cancelado
 *       404:
 *         description: Pedido não encontrado
 */
router.delete("/:id", async (req, res) => {
    try {
        await orderController.cancelOrder(req, res);
    } catch (error) {
        logger.error(`Erro ao cancelar pedido ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro interno do servidor",
        });
    }
});

export const orderRoutes = router;
