import { v4 as uuidv4 } from "uuid";
import { serverError, badRequest, ok } from "./helpers/index";
import {
    ProductService,
    ProductServiceProps,
} from "../services/productService";
import { createProductSchema } from "../schemas/product";
import { ZodError } from "zod";

export class ProductController {
    private productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async execute(httpRequest: { body: ProductServiceProps }) {
        try {
            const params = httpRequest.body;

            await createProductSchema.parseAsync(params);

            const { name, description, price, imageUrl, active } = params;
            const id = uuidv4();

            const product = await this.productService.execute({
                id,
                name,
                description,
                price,
                imageUrl,
                active,
                orderItems: [],
            });

            return ok(JSON.stringify(product));
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({ message: error.errors[0].message });
            }
            console.error(error);
            return serverError();
        }
    }
}
