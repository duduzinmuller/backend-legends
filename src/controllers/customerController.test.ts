import { CustomerController } from "./customerController";

describe("CustomerController", () => {
    class CustomerServiceStub {
        execute(customer: { name: string; email: string; phone: string }) {
            return customer;
        }
    }
    it("should return 201 when creating a customer successfully", async () => {
        //arrange
        const customerService = new CustomerServiceStub();
        const customerController = new CustomerController(customerService);

        //act
        const httpRequest = {
            body: {
                name: "Dudu",
                email: "dudu@gamer.com",
                phone: "6999137012",
            },
        };

        const result = await customerController.handle(httpRequest);
        //assert
        expect(result.statusCode).toBe(201);
    });
});
