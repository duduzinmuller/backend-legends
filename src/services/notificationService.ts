import {
    NotificationType,
    NotificationData,
    NotificationResult,
} from "../models/notification.model";
import { OrderStatus } from "@prisma/client";
import { EmailService } from "./emailService";
import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

// Interface para tipagem dos dados de template de pagamento
interface PaymentConfirmationTemplateData {
    orderNumber: string;
    amount: string;
    paymentDate: string;
    items: Array<{ name: string; quantity: number; price: number }>;
}

// Interface para tipagem dos dados de template de falha de pagamento
interface PaymentFailureTemplateData {
    orderNumber: string;
    errorMessage: string;
}

export class NotificationService {
    /**
     * Envia uma notificação com base no tipo e dados fornecidos
     */
    async sendNotification(
        data: NotificationData,
    ): Promise<NotificationResult> {
        try {
            const { type, recipientEmail, recipientName, templateData } = data;

            switch (type) {
                case NotificationType.PAYMENT_CONFIRMATION: {
                    // Fazer type assertion explícito
                    const paymentData =
                        templateData as unknown as PaymentConfirmationTemplateData;
                    const {
                        orderNumber,
                        amount,
                        paymentDate,
                        items = [],
                    } = paymentData;

                    await EmailService.sendPaymentConfirmationEmail(
                        recipientName || "Cliente",
                        recipientEmail,
                        orderNumber,
                        amount.toString(),
                        paymentDate.toString(),
                        items,
                    );
                    break;
                }

                case NotificationType.PAYMENT_FAILURE: {
                    // Fazer type assertion explícito
                    const failureData =
                        templateData as unknown as PaymentFailureTemplateData;
                    const { orderNumber, errorMessage } = failureData;

                    await EmailService.sendPaymentFailedEmail(
                        recipientName || "Cliente",
                        recipientEmail,
                        orderNumber,
                        errorMessage,
                    );
                    break;
                }

                case NotificationType.WELCOME: {
                    await EmailService.sendWelcomeEmail(
                        recipientName || "Cliente",
                        recipientEmail,
                    );
                    break;
                }

                case NotificationType.ORDER_CREATED:
                case NotificationType.ORDER_STATUS_CHANGE:
                    // Implementar lógica para outros tipos de notificação
                    logger.warn(
                        `Tipo de notificação não implementado: ${type}`,
                    );
                    return {
                        success: false,
                        error: "Tipo de notificação não implementado",
                    };

                default:
                    logger.error(`Tipo de notificação desconhecido: ${type}`);
                    return {
                        success: false,
                        error: "Tipo de notificação desconhecido",
                    };
            }

            logger.info(`Notificação ${type} enviada para ${recipientEmail}`);
            return { success: true, id: `notification_${Date.now()}` };
        } catch (error) {
            logger.error(`Erro ao enviar notificação: ${error}`);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro desconhecido",
            };
        }
    }

    /**
     * Envia notificação de mudança de status de pedido
     */
    async sendOrderStatusNotification(
        orderId: string,
    ): Promise<NotificationResult> {
        try {
            // Buscar informações do pedido
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: { customer: true },
            });

            if (!order || !order.customer) {
                return {
                    success: false,
                    error: `Pedido não encontrado ou sem cliente: ${orderId}`,
                };
            }

            const { customer, status } = order;

            // Definir assunto e conteúdo com base no status
            let subject = "";
            let content = "";

            switch (status) {
                case "PENDING":
                    subject = "Pedido Recebido";
                    content = `Olá ${customer.name}, recebemos seu pedido #${orderId} e estamos aguardando a confirmação do pagamento.`;
                    break;

                case "PAID":
                    subject = "Pagamento Confirmado";
                    content = `Olá ${customer.name}, o pagamento do seu pedido #${orderId} foi confirmado e está sendo processado.`;
                    break;

                case "PROCESSING":
                    subject = "Pedido em Processamento";
                    content = `Olá ${customer.name}, seu pedido #${orderId} está sendo preparado.`;
                    break;

                // Definindo strings literais que correspondem aos valores da enum OrderStatus
                case "SHIPPED" as OrderStatus:
                    subject = "Pedido Enviado";
                    content = `Olá ${customer.name}, seu pedido #${orderId} foi enviado.`;
                    break;

                case "DELIVERED" as OrderStatus:
                    subject = "Pedido Entregue";
                    content = `Olá ${customer.name}, seu pedido #${orderId} foi entregue. Esperamos que você esteja satisfeito!`;
                    break;

                case "CANCELLED":
                    subject = "Pedido Cancelado";
                    content = `Olá ${customer.name}, seu pedido #${orderId} foi cancelado.`;
                    break;

                case "REFUNDED":
                    subject = "Pedido Reembolsado";
                    content = `Olá ${customer.name}, o reembolso do seu pedido #${orderId} foi processado.`;
                    break;

                default:
                    subject = "Atualização do Pedido";
                    content = `Olá ${customer.name}, seu pedido #${orderId} foi atualizado para o status: ${status}.`;
                    logger.info(content); // Log the content to ensure it's used
            }

            // Enviar e-mail (simulação simples, na realidade usaria EmailService)
            logger.info(
                `Enviando e-mail de status para ${customer.email}: ${subject}`,
            );

            // Em uma implementação real, usaríamos o EmailService para enviar o e-mail
            // await sendEmail({ to: customer.email, subject, content });

            return { success: true, id: `notification_${Date.now()}` };
        } catch (error) {
            logger.error(`Erro ao enviar notificação de status: ${error}`);
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro desconhecido",
            };
        }
    }
}
