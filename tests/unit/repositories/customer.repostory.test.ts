import { CustomerRepository } from "../../../src/repositories";
import { prismaMock } from "../../utils/prisma-mock";
import { Customer as PrismaCustomer } from "@prisma/client";

interface Customer extends PrismaCustomer {
    document: string;
}

describe("CustomerRepository", () => {
    let customerRepository: CustomerRepository;

    beforeEach(() => {
        customerRepository = new CustomerRepository();
        (
            customerRepository as unknown as { prisma: typeof prismaMock }
        ).prisma = prismaMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a customer successfully", async () => {
            // Arrange
            const customerData = {
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                document: "123.456.789-00",
            };

            const expectedCustomer: Customer = {
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                document: "123.456.789-00",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.customer.create.mockResolvedValue(expectedCustomer);

            // Act
            const result = await customerRepository.create(customerData);

            // Assert
            expect(prismaMock.customer.create).toHaveBeenCalledWith({
                data: customerData,
            });
            expect(result).toEqual(expectedCustomer);
        });

        it("should throw an error when creation fails", async () => {
            // Arrange
            const customerData = {
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                document: "123.456.789-00",
            };

            const error = new Error("Database error");
            prismaMock.customer.create.mockRejectedValue(error);

            // Act & Assert
            await expect(
                customerRepository.create(customerData),
            ).rejects.toThrow(error);
        });
    });

    describe("findById", () => {
        it("should find a customer by ID", async () => {
            // Arrange
            const customerId = "123e4567-e89b-12d3-a456-426614174000";
            const expectedCustomer: Customer = {
                id: customerId,
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                document: "123.456.789-00",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.customer.findUnique.mockResolvedValue(expectedCustomer);

            // Act
            const result = await customerRepository.findById(customerId);

            // Assert
            expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
                where: { id: customerId },
            });
            expect(result).toEqual(expectedCustomer);
        });

        it("should return null when customer is not found", async () => {
            // Arrange
            const customerId = "non-existent-id";
            prismaMock.customer.findUnique.mockResolvedValue(null);

            // Act
            const result = await customerRepository.findById(customerId);

            // Assert
            expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
                where: { id: customerId },
            });
            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        it("should update a customer successfully", async () => {
            // Arrange
            const customerId = "123e4567-e89b-12d3-a456-426614174000";
            const updateData = {
                name: "John Updated",
                phone: "987654321",
            };

            const expectedCustomer: Customer = {
                id: customerId,
                name: "John Updated",
                email: "john@example.com",
                phone: "987654321",
                document: "123.456.789-00",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.customer.update.mockResolvedValue(expectedCustomer);

            // Act
            const result = await customerRepository.update(
                customerId,
                updateData,
            );

            // Assert
            expect(prismaMock.customer.update).toHaveBeenCalledWith({
                where: { id: customerId },
                data: updateData,
            });
            expect(result).toEqual(expectedCustomer);
        });
    });

    describe("delete", () => {
        it("should delete a customer", async () => {
            // Arrange
            const customerId = "123e4567-e89b-12d3-a456-426614174000";
            const deletedCustomer: Customer = {
                id: customerId,
                name: "John Doe",
                email: "john@example.com",
                phone: "123456789",
                document: "123.456.789-00",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.customer.delete.mockResolvedValue(deletedCustomer);

            // Act
            const result = await customerRepository.delete(customerId);

            // Assert
            expect(prismaMock.customer.delete).toHaveBeenCalledWith({
                where: { id: customerId },
            });
            expect(result).toEqual(deletedCustomer);
        });
    });
});
