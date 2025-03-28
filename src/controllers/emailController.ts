import { Request, Response } from "express";
import { EmailService } from "../services/emailService";
import { logger } from "../utils/logger";

export class EmailController {
    /**
     * Controla a requisição para enviar um e-mail de confirmação de pagamento
     */
    public static async sendPaymentConfirmation(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const {
            customerName,
            customerEmail,
            orderNumber,
            amount,
            paymentDate,
            items,
        } = req.body;

        // Validação dos campos obrigatórios
        if (
            !customerName ||
            !customerEmail ||
            !orderNumber ||
            !amount ||
            !paymentDate
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Campos obrigatórios não fornecidos: customerName, customerEmail, orderNumber, amount, paymentDate",
            });
        }

        // Validação básica de email
        if (!EmailController.isValidEmail(customerEmail)) {
            return res.status(400).json({
                status: "error",
                message: "O endereço de email fornecido é inválido",
            });
        }

        try {
            await EmailService.sendPaymentConfirmationEmail(
                customerName,
                customerEmail,
                orderNumber,
                amount,
                paymentDate,
                items || [],
            );

            logger.info(
                `Email de confirmação de pagamento enviado com sucesso para ${customerEmail}`,
            );
            return res.status(200).json({
                status: "success",
                message:
                    "E-mail de confirmação de pagamento enviado com sucesso.",
            });
        } catch (error) {
            logger.error(
                "Erro ao enviar email de confirmação de pagamento:",
                error,
            );
            return res.status(500).json({
                status: "error",
                message: "Erro ao enviar o e-mail de confirmação de pagamento.",
                error,
            });
        }
    }

    /**
     * Controla a requisição para enviar um e-mail de falha no pagamento
     */
    public static async sendPaymentFailed(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const { customerName, customerEmail, orderNumber, errorMessage } =
            req.body;

        // Validação dos campos obrigatórios
        if (!customerName || !customerEmail || !orderNumber || !errorMessage) {
            return res.status(400).json({
                status: "error",
                message:
                    "Campos obrigatórios não fornecidos: customerName, customerEmail, orderNumber, errorMessage",
            });
        }

        // Validação básica de email
        if (!EmailController.isValidEmail(customerEmail)) {
            return res.status(400).json({
                status: "error",
                message: "O endereço de email fornecido é inválido",
            });
        }

        try {
            await EmailService.sendPaymentFailedEmail(
                customerName,
                customerEmail,
                orderNumber,
                errorMessage,
            );

            logger.info(
                `Email de falha no pagamento enviado com sucesso para ${customerEmail}`,
            );
            return res.status(200).json({
                status: "success",
                message: "E-mail de falha no pagamento enviado com sucesso.",
            });
        } catch (error) {
            logger.error("Erro ao enviar email de falha no pagamento:", error);
            return res.status(500).json({
                status: "error",
                message: "Erro ao enviar o e-mail de falha no pagamento.",
                error,
            });
        }
    }

    /**
     * Controla a requisição para enviar um e-mail de boas-vindas
     */
    public static async sendWelcome(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const { customerName, customerEmail } = req.body;

        // Validação dos campos obrigatórios
        if (!customerName || !customerEmail) {
            return res.status(400).json({
                status: "error",
                message:
                    "Campos obrigatórios não fornecidos: customerName, customerEmail",
            });
        }

        // Validação básica de email
        if (!EmailController.isValidEmail(customerEmail)) {
            return res.status(400).json({
                status: "error",
                message: "O endereço de email fornecido é inválido",
            });
        }

        try {
            await EmailService.sendWelcomeEmail(customerName, customerEmail);

            logger.info(
                `Email de boas-vindas enviado com sucesso para ${customerEmail}`,
            );
            return res.status(200).json({
                status: "success",
                message: "E-mail de boas-vindas enviado com sucesso.",
            });
        } catch (error) {
            logger.error("Erro ao enviar email de boas-vindas:", error);
            return res.status(500).json({
                status: "error",
                message: "Erro ao enviar o e-mail de boas-vindas.",
                error,
            });
        }
    }

    /**
     * Método auxiliar para validação básica de email
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
