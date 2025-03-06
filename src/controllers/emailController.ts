import { Request, Response } from "express";
import { EmailService } from "../services/emailService";

export class EmailController {
    /**
     * Controla a requisição para enviar um e-mail de confirmação de pagamento
     */
    public static async sendPaymentConfirmation(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const { customerName, orderNumber, amount, paymentDate, items } =
            req.body;

        try {
            await EmailService.sendPaymentConfirmationEmail(
                customerName,
                orderNumber,
                amount,
                paymentDate,
                items,
            );
            return res.status(200).json({
                message:
                    "E-mail de confirmação de pagamento enviado com sucesso.",
            });
        } catch (error) {
            return res.status(500).json({
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
        const { customerName, orderNumber, errorMessage } = req.body;

        try {
            await EmailService.sendPaymentFailedEmail(
                customerName,
                orderNumber,
                errorMessage,
            );
            return res.status(200).json({
                message: "E-mail de falha no pagamento enviado com sucesso.",
            });
        } catch (error) {
            return res.status(500).json({
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
        const { customerName } = req.body;

        try {
            await EmailService.sendWelcomeEmail(customerName);
            return res.status(200).json({
                message: "E-mail de boas-vindas enviado com sucesso.",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao enviar o e-mail de boas-vindas.",
                error,
            });
        }
    }
}
