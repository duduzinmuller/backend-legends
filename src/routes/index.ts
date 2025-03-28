import express from "express";
import { customerControllerRouter } from "./customerRoutes";
import { orderRoutes } from "./orderRoutes";
import { paymentRoutes } from "./paymentRoutes";
import { webhookRoutes } from "./webhookRoutes";
import { emailRoutes } from "./emailRoutes";

const router = express.Router();

// Registra as rotas
router.use("/customers", customerControllerRouter);
router.use("/orders", orderRoutes);
router.use("/email", emailRoutes);
router.use("/payments", paymentRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
