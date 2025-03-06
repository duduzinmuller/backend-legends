import {
    sendEmail,
    EmailData,
    getPaymentConfirmationTemplate,
    getPaymentFailedTemplate,
    getWelcomeTemplate,
} from "../config/email.config";

export class EmailService {
    /**
     * Envia um e-mail de confirmação de pagamento
     * @param customerName Nome do cliente
     * @param orderNumber Número do pedido
     * @param amount Valor do pedido
     * @param paymentDate Data do pagamento
     * @param items Lista de itens no pedido
     */
    public static async sendPaymentConfirmationEmail(
        customerName: string,
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
            to: customerName, // Ajuste para o e-mail do cliente
            subject,
            html,
        };

        await sendEmail(emailData);
    }

    /**
     * Envia um e-mail de falha no pagamento
     * @param customerName Nome do cliente
     * @param orderNumber Número do pedido
     * @param errorMessage Mensagem de erro
     */
    public static async sendPaymentFailedEmail(
        customerName: string,
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
            to: customerName, // Ajuste para o e-mail do cliente
            subject,
            html,
        };

        await sendEmail(emailData);
    }

    /**
     * Envia um e-mail de boas-vindas
     * @param customerName Nome do cliente
     */

    public static async sendWelcomeEmail(customerName: string): Promise<void> {
        const subject = "Bem-vindo à nossa plataforma!";
        const html = getWelcomeTemplate(customerName);

        const emailData: EmailData = {
            to: customerName, // Ajuste para o e-mail do cliente
            subject,
            html,
        };

        await sendEmail(emailData);
    }
}
