import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

// Criando um mock profundo do Prisma Client
export const prismaMock =
    mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

// Mockar o módulo do cliente Prisma
jest.mock("../../src/repositories/prisma.client", () => ({
    __esModule: true,
    default: prismaMock,
    prisma: prismaMock,
}));

// Resetar todos os mocks antes de cada teste
beforeEach(() => {
    mockReset(prismaMock);
});
