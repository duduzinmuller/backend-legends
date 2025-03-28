import express from "express";
import { customerControllerRouter } from "./customerRoutes";
import { orderRoutes } from "./orderRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { webhookRoutes } from "./webhookRoutes";
import { emailRouter } from "./emailRoutes";

const router = express.Router();

// Registra as rotas
router.use("/customers", customerControllerRouter);
router.use("/orders", orderRoutes);
router.use("/email", emailRouter);
router.use("/payments", paymentRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
