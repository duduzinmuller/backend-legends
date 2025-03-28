import { Request, Response } from "express";
import { OrderService } from "../services/orderService";

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
}
