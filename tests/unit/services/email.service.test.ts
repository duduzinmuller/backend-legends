import { EmailService } from "../../../src/services/emailService";
import * as emailConfig from "../../../src/config/email.config";

// Mock das funções de configuração de email
jest.mock("../../../src/config/email.config", () => ({
    sendEmail: jest.fn(),
    getPaymentConfirmationTemplate: jest
        .fn()
        .mockReturnValue("<html>Mock Template</html>"),
    getPaymentFailedTemplate: jest
        .fn()
        .mockReturnValue("<html>Mock Failed Template</html>"),
    getWelcomeTemplate: jest
        .fn()
        .mockReturnValue("<html>Mock Welcome Template</html>"),
}));

describe("EmailService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendPaymentConfirmationEmail", () => {
        it("should call sendEmail with correct data", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";
            const orderNumber = "ORD-12345";
            const amount = "199.99";
            const paymentDate = "2025-03-28";
            const items = [{ name: "Product 1", quantity: 2, price: 99.99 }];

            // Act
            await EmailService.sendPaymentConfirmationEmail(
                customerName,
                customerEmail,
                orderNumber,
                amount,
                paymentDate,
                items,
            );

            // Assert
            expect(
                emailConfig.getPaymentConfirmationTemplate,
            ).toHaveBeenCalledWith(
                customerName,
                orderNumber,
                amount,
                paymentDate,
                items,
            );

            expect(emailConfig.sendEmail).toHaveBeenCalledWith({
                to: customerEmail,
                subject: "Confirmação de Pagamento",
                html: "<html>Mock Template</html>",
            });
        });

        it("should throw error if sendEmail fails", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";
            const orderNumber = "ORD-12345";
            const amount = "199.99";
            const paymentDate = "2025-03-28";
            const items = [{ name: "Product 1", quantity: 2, price: 99.99 }];

            const error = new Error("Email sending failed");
            (emailConfig.sendEmail as jest.Mock).mockRejectedValueOnce(error);

            // Act & Assert
            await expect(
                EmailService.sendPaymentConfirmationEmail(
                    customerName,
                    customerEmail,
                    orderNumber,
                    amount,
                    paymentDate,
                    items,
                ),
            ).rejects.toThrow("Email sending failed");
        });
    });

    describe("sendPaymentFailedEmail", () => {
        it("should call sendEmail with correct data", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";
            const orderNumber = "ORD-12345";
            const errorMessage = "Cartão recusado";

            // Act
            await EmailService.sendPaymentFailedEmail(
                customerName,
                customerEmail,
                orderNumber,
                errorMessage,
            );

            // Assert
            expect(emailConfig.getPaymentFailedTemplate).toHaveBeenCalledWith(
                customerName,
                orderNumber,
                errorMessage,
            );

            expect(emailConfig.sendEmail).toHaveBeenCalledWith({
                to: customerEmail,
                subject: "Problema com Pagamento",
                html: "<html>Mock Failed Template</html>",
            });
        });

        it("should throw error if sendEmail fails", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";
            const orderNumber = "ORD-12345";
            const errorMessage = "Cartão recusado";

            const error = new Error("Email sending failed");
            (emailConfig.sendEmail as jest.Mock).mockRejectedValueOnce(error);

            // Act & Assert
            await expect(
                EmailService.sendPaymentFailedEmail(
                    customerName,
                    customerEmail,
                    orderNumber,
                    errorMessage,
                ),
            ).rejects.toThrow("Email sending failed");
        });
    });

    describe("sendWelcomeEmail", () => {
        it("should call sendEmail with correct data", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";

            // Act
            await EmailService.sendWelcomeEmail(customerName, customerEmail);

            // Assert
            expect(emailConfig.getWelcomeTemplate).toHaveBeenCalledWith(
                customerName,
            );

            expect(emailConfig.sendEmail).toHaveBeenCalledWith({
                to: customerEmail,
                subject: "Bem-vindo à nossa plataforma!",
                html: "<html>Mock Welcome Template</html>",
            });
        });

        it("should throw error if sendEmail fails", async () => {
            // Arrange
            const customerName = "John Doe";
            const customerEmail = "john@example.com";

            const error = new Error("Email sending failed");
            (emailConfig.sendEmail as jest.Mock).mockRejectedValueOnce(error);

            // Act & Assert
            await expect(
                EmailService.sendWelcomeEmail(customerName, customerEmail),
            ).rejects.toThrow("Email sending failed");
        });
    });
});
