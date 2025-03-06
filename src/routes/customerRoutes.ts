import express from "express";
import { CustomerController } from "../controllers/customerController";
import { CustomerServiceImpl } from "../services/customerService";

const router = express.Router();
const customerService = new CustomerServiceImpl();
const customerController = new CustomerController(customerService);

router.post("/create/customer", async (request, response) => {
    const customerResponse = await customerController.handle({
        body: request.body,
    });

    response.status(customerResponse.statusCode).send(customerResponse.body);
});

export const customerControllerRouter = router;
