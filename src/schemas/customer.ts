import { z } from "zod";

export const createCustomerSchema = z.object({
    name: z
        .string({
            required_error: "O campo do nome não pode ficar em branco.",
        })
        .trim()
        .min(1, {
            message: "Nome é obrigatório.",
        }),
    email: z
        .string({
            required_error: "O campo do e-mail não pode ficar em branco.",
        })
        .email({
            message: "E-mail inválido.",
        })
        .trim()
        .min(1, {
            message: "O email é obrigatório",
        }),
    phone: z
        .string({
            required_error: "O campo do telefone não pode ficar em branco.",
        })
        .trim()
        .regex(/^\d+$/, {
            message: "O telefone deve conter apenas números.",
        }),
});
