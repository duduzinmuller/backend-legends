import "dotenv/config";
import express from "express";
import { customerControllerRouter } from "./routes/customerRoutes";

const app = express();
app.use(express.json());

app.use(customerControllerRouter);

app.listen(8000, () => console.log("Rodando na porta 8000"));
