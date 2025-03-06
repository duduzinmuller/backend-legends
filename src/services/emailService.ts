import { Resend } from "resend";
import { prisma } from "../utils/prisma";
import { logger } from "../utils/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
    async sendEmail({
        recipient,
        subject,
        content,
        from = `Payment Automation <${process.env.RESEND_FROM_EMAIL || "notifications@example.com"}>`,
    }: {
        recipient: string;
        subject: string;
        content: string;
        from?: string;
    }) {
        try {
            const emailNotification = await prisma.emailNotification.create({
                data: {
                    recipient,
                    subject,
                    content,
                    status: "PENDING",
                },
            });

            const { data, error } = await resend.emails.send({
                from,
                to: recipient,
                subject,
                html: content,
            });

            if (error) {
                logger.error("Erro ao enviar email:", error);

                await prisma.emailNotification.update({
                    where: { id: emailNotification.id },
                    data: {
                        status: "FAILED",
                        errorMessage: error.message,
                    },
                });
                throw new Error(`Falha ao enviar email: ${error.message}`);
            }

            logger.info(
                `Email enviado com sucesso para ${recipient}. ID: ${data?.id}`,
            );

            await prisma.emailNotification.update({
                where: { id: emailNotification.id },
                data: {
                    status: "SENT",
                    sentAt: new Date(),
                },
            });

            return data;
        } catch (error) {
            logger.error("Erro ao enviar email:", error);
            throw error;
        }
    }
}
