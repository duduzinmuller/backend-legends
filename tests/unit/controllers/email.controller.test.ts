import { EmailController } from "../../../src/controllers/emailController";
import { EmailService } from "../../../src/services/emailService";
import { mockRequest, mockResponse } from "../../utils/test-utils";

// Mock do serviço de email
jest.mock("../../../src/services/emailService", () => ({
    EmailService: {
        sendPaymentConfirmationEmail: jest.fn(),
        sendPaymentFailedEmail: jest.fn(),
        sendWelcomeEmail: jest.fn(),
    },
}));

describe("EmailController", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendPaymentConfirmation", () => {
        it("should return 200 when email is sent successfully", async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    orderNumber: "ORD-12345",
                    amount: "199.99",
                    paymentDate: "2025-03-28",
                    items: [{ name: "Product 1", quantity: 2, price: 99.99 }],
                },
            });
            const res = mockResponse();

            (
                EmailService.sendPaymentConfirmationEmail as jest.Mock
            ).mockResolvedValue(undefined);

            await EmailController.sendPaymentConfirmation(
                req,
                res as ReturnType<typeof mockResponse>,
            );

            // Assert
            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).toHaveBeenCalledWith(
                "John Doe",
                "john@example.com",
                "ORD-12345",
                "199.99",
                "2025-03-28",
                [{ name: "Product 1", quantity: 2, price: 99.99 }],
            );

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: "success",
                message:
                    "E-mail de confirmação de pagamento enviado com sucesso.",
            });
        });

        it("should return 400 when required fields are missing", async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    customerName: "John Doe",
                    // Missing required fields
                },
            });
            const res = mockResponse();

            await EmailController.sendPaymentConfirmation(
                req,
                res as ReturnType<typeof mockResponse>,
            );

            // Assert
            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: "error",
                message:
                    "Campos obrigatórios não fornecidos: customerName, customerEmail, orderNumber, amount, paymentDate",
            });
        });

        it("should return 400 when email is invalid", async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    customerName: "John Doe",
                    customerEmail: "invalid-email",
                    orderNumber: "ORD-12345",
                    amount: "199.99",
                    paymentDate: "2025-03-28",
                },
            });
            const res = mockResponse();

            await EmailController.sendPaymentConfirmation(
                req,
                res as ReturnType<typeof mockResponse>,
            );

            // Assert
            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: "error",
                message: "O endereço de email fornecido é inválido",
            });
        });

        it("should return 500 when email service throws an error", async () => {
            // Arrange
            const req = mockRequest({
                body: {
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    orderNumber: "ORD-12345",
                    amount: "199.99",
                    paymentDate: "2025-03-28",
                },
            });
            const res = mockResponse();

            const error = new Error("Email service error");
            (
                EmailService.sendPaymentConfirmationEmail as jest.Mock
            ).mockRejectedValue(error);

            await EmailController.sendPaymentConfirmation(
                req,
                res as ReturnType<typeof mockResponse>,
            );

            // Assert
            expect(
                EmailService.sendPaymentConfirmationEmail,
            ).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: "error",
                message: "Erro ao enviar o e-mail de confirmação de pagamento.",
                error,
            });
        });
    });

    // Testes para os outros métodos (sendPaymentFailed e sendWelcome) seguiriam
    // o mesmo padrão que os testes acima
});
