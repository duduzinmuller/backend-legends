import express from "express";
import { CustomerController } from "../controllers/customerController";

const router = express.Router();

router.post("/create/customer", async (request, response) => {
    const customerResponse = await CustomerController({ body: request.body });

    const { statusCode, body } = customerResponse;

    response.status(statusCode).send(body);
});

export const customerControllerRouter = router;
