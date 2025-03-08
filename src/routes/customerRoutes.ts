import express, { Request, Response } from "express";
import { CustomerController } from "../controllers/customerController";
import { CustomerServiceImpl } from "../services/customerService";
import { logger } from "../utils/logger";

const router = express.Router();
const customerService = new CustomerServiceImpl();
const customerController = new CustomerController(customerService);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const customerResponse = await customerController.handle({
            body: req.body,
        });

        // Tratando o log de forma segura, verificando o tipo de body
        if (
            typeof customerResponse.body === "object" &&
            customerResponse.body !== null
        ) {
            logger.info(
                `Cliente criado: ${JSON.stringify(customerResponse.body)}`,
            );
        } else {
            logger.info("Cliente criado com sucesso");
        }

        res.status(customerResponse.statusCode).json(customerResponse.body);
    } catch (error) {
        logger.error("Erro ao criar cliente:", error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get("/:id", async (req: Request, res: Response) => {
    try {
        // Aguardando implementação do método get
        res.status(501).json({
            status: "error",
            message: "Método não implementado",
        });
    } catch (error) {
        logger.error(`Erro ao buscar cliente ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", async (_req: Request, res: Response) => {
    try {
        // Aguardando implementação do método list
        res.status(501).json({
            status: "error",
            message: "Método não implementado",
        });
    } catch (error) {
        logger.error("Erro ao listar clientes:", error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Customers]
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
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put("/:id", async (req: Request, res: Response) => {
    try {
        // Aguardando implementação do método update
        res.status(501).json({
            status: "error",
            message: "Método não implementado",
        });
    } catch (error) {
        logger.error(`Erro ao atualizar cliente ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Cliente removido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        // Aguardando implementação do método delete
        res.status(501).json({
            status: "error",
            message: "Método não implementado",
        });
    } catch (error) {
        logger.error(`Erro ao remover cliente ${req.params.id}:`, error);
        res.status(500).json({
            status: "error",
            message: "Erro ao processar requisição",
        });
    }
});

export const customerControllerRouter = router;
