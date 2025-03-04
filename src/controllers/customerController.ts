import { CustomerService } from "../services/customerService";
import { v4 as uuidv4 } from "uuid";
import {
    badRequest,
    checkIfEmailIsValid,
    created,
    emailIsAlreadyInUseResponse,
    serverError,
} from "./helpers/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomerController = async (httpRequest: { body: any }) => {
    try {
        const params = httpRequest.body;

        const requiredFields = ["name", "email", "phone"];

        for (const field of requiredFields) {
            if (!params[field] || params[field].trim().length === 0) {
                return badRequest({ message: `Parametro ausente ${field}` });
            }
        }

        const emailIsValid = checkIfEmailIsValid(params.email);
        if (!emailIsValid) {
            return emailIsAlreadyInUseResponse();
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

        return created(JSON.stringify(customer));
    } catch (error) {
        console.error(error);
        return serverError();
    }
};
