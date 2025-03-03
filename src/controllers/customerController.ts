import { CustomerService } from "../services/customerService";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomerController = async (httpRequest: { body: any }) => {
    try {
        const params = httpRequest.body;

        const requiredFields = ["name", "email", "phone"];

        for (const field of requiredFields) {
            if (!params[field] || params[field].trim().length === 0) {
                return {
                    statusCode: 400,
                    body: {
                        message: `Parâmetro ausente: ${field}`,
                    },
                };
            }
        }

        const emailIsValid = validator.isEmail(params.email);

        if (!emailIsValid) {
            return {
                statusCode: 400,
                body: {
                    message: "E-mail inválido",
                },
            };
        }

        const { name, email, phone } = params;
        const id = uuidv4();

        const customer = await CustomerService({
            id,
            name,
            email,
            phone,
            orders: [],
        });

        return {
            statusCode: 201,
            body: customer,
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            message: "Erro interno no servidor",
        };
    }
};
