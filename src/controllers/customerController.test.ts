import { CustomerController } from "./customerController";

describe("CustomerController", () => {
    class CustomerServiceImpl {
        async execute(customer: {
            name: string;
            email: string;
            phone?: string;
        }) {
            return Promise.resolve({
                id: "uuid",
                name: customer.name,
                email: customer.email,
                phone: customer.phone ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }

    it("should return 201 when creating a customer successfully", async () => {
        // Arrange
        const customerService = new CustomerServiceImpl();
        const customerController = new CustomerController(customerService);

        // Act
        const httpRequest = {
            body: {
                name: "Dudu",
                email: "dudu@gamer.com",
                phone: "6999137012",
            },
        };

        const result = await customerController.handle(httpRequest);

        // Assert
        expect(result.statusCode).toBe(201);
    });
});
