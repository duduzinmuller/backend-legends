import { Resend } from "resend";
import { logger } from "../utils/logger";

// Inicializa o cliente Resend com a API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Enum de templates de email
export enum EmailTemplate {
    PAYMENT_CONFIRMATION = "payment-confirmation",
    PAYMENT_FAILED = "payment-failed",
    ORDER_CREATED = "order-created",
    ORDER_UPDATED = "order-updated",
    WELCOME = "welcome",
}

// Interface para os dados de email
export interface EmailData {
    to: string;
    subject: string;
    html: string;
    from?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{
        filename: string;
        content: Buffer;
    }>;
}

/**
 * Envia um email usando o serviço Resend
 */
export const sendEmail = async ({
    to,
    subject,
    html,
    from = `Payment Automation <${process.env.RESEND_FROM_EMAIL || "notifications@example.com"}>`,
    cc,
    bcc,
    attachments,
}: EmailData) => {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
            cc,
            bcc,
            attachments,
        });

        if (error) {
            logger.error("Erro ao enviar email:", error);
            throw new Error(`Falha ao enviar email: ${error.message}`);
        }

        logger.info(`Email enviado com sucesso para ${to}. ID: ${data?.id}`);
        return data;
    } catch (error) {
        logger.error("Erro ao enviar email:", error);
        throw error;
    }
};

/**
 * Gera template HTML para email de confirmação de pagamento
 */
export const getPaymentConfirmationTemplate = (
    customerName: string,
    orderNumber: string,
    amount: string,
    paymentDate: string,
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>,
): string => {
    // Gera linhas da tabela para os itens
    const itemsHtml = items
        .map(
            (item) => `
        <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `,
        )
        .join("");

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Confirmação de Pagamento</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; border-radius: 5px;">
        <h2 style="color: #2c3e50;">Confirmação de Pagamento</h2>
        <p>Olá ${customerName},</p>
        <p>Seu pagamento foi processado com sucesso!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Pedido:</strong> #${orderNumber}</p>
            <p><strong>Valor:</strong> R$ ${amount}</p>
            <p><strong>Data:</strong> ${paymentDate}</p>
        </div>
        
        <h3>Detalhes do Pedido</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
            <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qtd</th>
                <th style="padding: 10px; text-align: right;">Preço</th>
                <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
            </thead>
            <tbody>
            ${itemsHtml}
            </tbody>
            <tfoot>
            <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right;"><strong>R$ ${amount}</strong></td>
            </tr>
            </tfoot>
        </table>
        
        <p>Obrigado por sua compra!</p>
        <p>Atenciosamente,<br>Equipe de Suporte</p>
    </div>
    </body>
    </html>
`;
};

/**
 * Gera template HTML para email de falha no pagamento
 */
export const getPaymentFailedTemplate = (
    customerName: string,
    orderNumber: string,
    errorMessage: string,
): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Problema com Pagamento</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="padding: 20px; border-radius: 5px;">
        <h2 style="color: #e74c3c;">Problema com o Pagamento</h2>
        <p>Olá ${customerName},</p>
        <p>Identificamos um problema com o processamento do seu pagamento para o pedido #${orderNumber}.</p>
        
        <div style="background-color: #fff3f3; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #e74c3c;">
            <p><strong>Motivo:</strong> ${errorMessage}</p>
        </div>
        
        <p>Por favor, tente novamente ou entre em contato com nossa equipe de suporte caso precise de ajuda.</p>
        <p>Atenciosamente,<br>Equipe de Suporte</p>
    </div>
    </body>
    </html>
`;
};

/**
 * Gera template HTML para email de boas-vindas
 */
export const getWelcomeTemplate = (customerName: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bem-vindo!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="padding: 20px; border-radius: 5px;">
        <h2 style="color: #2c3e50;">Bem-vindo à nossa plataforma!</h2>
        <p>Olá ${customerName},</p>
        <p>Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso.</p>
        
        <div style="background-color: #f5f8fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>Com nossa plataforma, você pode:</p>
        <ul>
            <li>Gerenciar seus pedidos facilmente</li>
            <li>Efetuar pagamentos com segurança</li>
            <li>Acompanhar o status dos seus pedidos</li>
            <li>Entrar em contato com nossa equipe de suporte</li>
        </ul>
        </div>
        
        <p>Se precisar de qualquer ajuda, não hesite em nos contactar.</p>
        <p>Atenciosamente,<br>Equipe de Suporte</p>
</div>
    </body>
    </html>
`;
};

export default resend;
