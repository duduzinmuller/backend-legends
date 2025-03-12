import { z } from "zod";
import validator from "validator";

export const createProductSchema = z.object({
    name: z
        .string({
            required_error:
                "O campo do nome do produto não pode ficar em branco.",
        })
        .trim()
        .min(1, {
            message: "O nome do produto e obrigatório.",
        }),
    description: z.string().trim().min(1, {
        message: "A descrição do produto e obrigatória.",
    }),
    price: z
        .number({
            required_error: "O preço do produto e obrigatório",
            invalid_type_error: "O preço deve ser um número",
        })
        .min(1, {
            message: "O preço deve ser um valor valído",
        })
        .refine((value) => {
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: ".",
            });
        }),
});
