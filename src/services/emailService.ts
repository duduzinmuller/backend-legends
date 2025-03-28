import {
    sendEmail,
    EmailData,
    getPaymentConfirmationTemplate,
    getPaymentFailedTemplate,
    getWelcomeTemplate,
} from "../config/email.config";
import { logger } from "../utils/logger";

export class EmailService {
    /**
     * Envia um e-mail de confirmação de pagamento
     * @param customerName Nome do cliente
     * @param customerEmail Email do cliente
     * @param orderNumber Número do pedido
     * @param amount Valor do pedido
     * @param paymentDate Data do pagamento
     * @param items Lista de itens no pedido
     */
    public static async sendPaymentConfirmationEmail(
        customerName: string,
        customerEmail: string,
        orderNumber: string,
        amount: string,
        paymentDate: string,
        items: Array<{ name: string; quantity: number; price: number }>,
    ): Promise<void> {
        const subject = "Confirmação de Pagamento";
        const html = getPaymentConfirmationTemplate(
            customerName,
            orderNumber,
            amount,
            paymentDate,
            items,
        );

        const emailData: EmailData = {
            to: customerEmail,
            subject,
            html,
        };

        logger.info(
            `Enviando email de confirmação de pagamento para: ${customerEmail}`,
        );
        await sendEmail(emailData);
    }

    /**
     * Envia um e-mail de falha no pagamento
     * @param customerName Nome do cliente
     * @param customerEmail Email do cliente
     * @param orderNumber Número do pedido
     * @param errorMessage Mensagem de erro
     */
    public static async sendPaymentFailedEmail(
        customerName: string,
        customerEmail: string,
        orderNumber: string,
        errorMessage: string,
    ): Promise<void> {
        const subject = "Problema com Pagamento";
        const html = getPaymentFailedTemplate(
            customerName,
            orderNumber,
            errorMessage,
        );
        const emailData: EmailData = {
            to: customerEmail,
            subject,
            html,
        };

        logger.info(
            `Enviando email de falha de pagamento para: ${customerEmail}`,
        );
        await sendEmail(emailData);
    }

    /**
     * Envia um e-mail de boas-vindas
     * @param customerName Nome do cliente
     * @param customerEmail Email do cliente
     */
    public static async sendWelcomeEmail(
        customerName: string,
        customerEmail: string,
    ): Promise<void> {
        const subject = "Bem-vindo à nossa plataforma!";
        const html = getWelcomeTemplate(customerName);

        const emailData: EmailData = {
            to: customerEmail,
            subject,
            html,
        };

        logger.info(`Enviando email de boas-vindas para: ${customerEmail}`);
        await sendEmail(emailData);
    }
}
