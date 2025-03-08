import { Customer } from "@prisma/client";

export type CustomerCreate = Omit<Customer, "id" | "createdAt" | "updatedAt">;

export type CustomerUpdate = Partial<CustomerCreate>;

export { Customer };
