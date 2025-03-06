import { v4 as uuidv4 } from "uuid";
import { created, serverError, badRequest } from "./helpers/index";
import { createCustomerSchema } from "../schemas/customer";
import { ZodError } from "zod";
import { CustomerServiceImpl } from "../services/customerService";

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

export class CustomerController {
    private customerService: CustomerServiceImpl;

    constructor(customerService: CustomerServiceImpl) {
        this.customerService = customerService;
    }

    async handle(httpRequest: {
        body: { name: string; email: string; phone?: string };
    }) {
        try {
            const params = httpRequest.body;

            await createCustomerSchema.parseAsync(params);

            const { name, email, phone } = params;
            const id = uuidv4();

            const customer = await this.customerService.execute({
                id,
                name,
                email,
                phone,
                orders: [],
            });

            return created(JSON.stringify(customer));
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            console.error(error);
            return serverError();
        }
    }
}
