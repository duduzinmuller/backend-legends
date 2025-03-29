import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import { logger } from "../utils/logger";

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    async createOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { customerId, items } = req.body;

            if (!customerId || !Array.isArray(items) || items.length === 0) {
                return res
                    .status(400)
                    .json({ error: "Cliente e itens são obrigatórios." });
            }

            const order = await this.orderService.createOrder(
                customerId,
                items,
            );
            return res.status(201).json(order);
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    }

    async getOrderById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const order = await this.orderService.findById(id);
            if (!order) {
                return res.status(404).json({
                    status: "error",
                    message: "Pedido não encontrado",
                });
            }
            res.status(200).json(order);
        } catch (error) {
            logger.error(`Erro ao buscar pedido ${id}:`, error);
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor",
            });
        }
    }

    async listOrders(req: Request, res: Response) {
        try {
            const orders = await this.orderService.listAll(req.query);
            res.status(200).json(orders);
        } catch (error) {
            logger.error("Erro ao listar pedidos:", error);
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor",
            });
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const updatedOrder = await this.orderService.updateStatus(
                id,
                status,
            );
            if (!updatedOrder) {
                return res.status(404).json({
                    status: "error",
                    message: "Pedido não encontrado",
                });
            }
            res.status(200).json({
                message: "Status atualizado com sucesso",
                order: updatedOrder,
            });
        } catch (error) {
            logger.error(`Erro ao atualizar status do pedido ${id}:`, error);
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor",
            });
        }
    }

    async cancelOrder(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const cancelledOrder = await this.orderService.cancel(id);
            if (!cancelledOrder) {
                return res.status(404).json({
                    status: "error",
                    message: "Pedido não encontrado",
                });
            }
            res.status(200).json({
                message: "Pedido cancelado com sucesso",
                order: cancelledOrder,
            });
        } catch (error) {
            logger.error(`Erro ao cancelar pedido ${id}:`, error);
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor",
            });
        }
    }
}
