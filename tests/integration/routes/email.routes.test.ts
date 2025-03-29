import request from "supertest";
import app from "../../../src/app";
import { EmailService } from "../../../src/services/emailService";

// Mock do serviço de email
jest.mock("../../../src/services/emailService", () => ({
    EmailService: {
        sendPaymentConfirmationEmail: jest.fn(),
        sendPaymentFailedEmail: jest.fn(),
        sendWelcomeEmail: jest.fn(),
    },
}));

describe("Email Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/send-email/welcome", () => {
        it("should send welcome email and return 200", async () => {
            // Arrange
            (EmailService.sendWelcomeEmail as jest.Mock).mockResolvedValue(
                undefined,
            );

            // Act & Assert
            await request(app)
                .post("/api/send-email/welcome")
                .send({
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                })
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        status: "success",
                        message: "E-mail de boas-vindas enviado com sucesso.",
                    });
                });

            expect(EmailService.sendWelcomeEmail).toHaveBeenCalledWith(
                "John Doe",
                "john@example.com",
            );
        });

        it("should return 400 when required fields are missing", async () => {
            // Act & Assert
            await request(app)
                .post("/api/send-email/welcome")
                .send({
                    customerName: "John Doe",
                    // Missing customerEmail
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        status: "error",
                        message:
                            "Campos obrigatórios não fornecidos: customerName, customerEmail",
                    });
                });

            expect(EmailService.sendWelcomeEmail).not.toHaveBeenCalled();
        });

        it("should return 500 when email service throws an error", async () => {
            // Arrange
            const error = new Error("Email service error");
            (EmailService.sendWelcomeEmail as jest.Mock).mockRejectedValue(
                error,
            );

            // Act & Assert
            await request(app)
                .post("/api/send-email/welcome")
                .send({
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                })
                .expect(500)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        status: "error",
                        error: {}, // Incluído para corresponder à resposta real
                        message: "Erro ao enviar o e-mail de boas-vindas.",
                    });
                });
        });
    });

    describe("POST /api/send-email/payment-confirmation", () => {
        it("should send payment confirmation email and return 200", async () => {
            // Arrange
            (
                EmailService.sendPaymentConfirmationEmail as jest.Mock
            ).mockResolvedValue(undefined);

            // Act & Assert
            await request(app)
                .post("/api/send-email/payment-confirmation")
                .send({
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    orderNumber: "ORD-12345",
                    amount: "199.99",
                    paymentDate: "2025-03-28",
                    items: [{ name: "Product 1", quantity: 2, price: 99.99 }],
                })
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        status: "success",
                        message:
                            "E-mail de confirmação de pagamento enviado com sucesso.",
                    });
                });

            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).toHaveBeenCalled();
        });

        it("should return 400 when required fields are missing", async () => {
            // Act & Assert
            await request(app)
                .post("/api/send-email/payment-confirmation")
                .send({
                    customerName: "John Doe",
                    // Missing other required fields
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.status).toBe("error");
                });

            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).not.toHaveBeenCalled();
        });
    });

    describe("POST /api/send-email/payment-failed", () => {
        it("should send payment failed email and return 200", async () => {
            // Arrange
            (
                EmailService.sendPaymentFailedEmail as jest.Mock
            ).mockResolvedValue(undefined);

            // Act & Assert
            await request(app)
                .post("/api/send-email/payment-failed")
                .send({
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    orderNumber: "ORD-12345",
                    errorMessage: "Cartão recusado",
                })
                .expect(200)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body).toEqual({
                        status: "success",
                        message:
                            "E-mail de falha no pagamento enviado com sucesso.",
                    });
                });

            expect(EmailService.sendPaymentFailedEmail).toHaveBeenCalled();
        });

        it("should return 400 when required fields are missing", async () => {
            // Act & Assert
            await request(app)
                .post("/api/send-email/payment-failed")
                .send({
                    customerName: "John Doe",
                    // Missing other required fields
                })
                .expect(400)
                .expect("Content-Type", /json/)
                .expect((res) => {
                    expect(res.body.status).toBe("error");
                });

            expect(EmailService.sendPaymentFailedEmail).not.toHaveBeenCalled();
        });
    });
});
