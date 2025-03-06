import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { logger } from "../utils/logger";

let mercadopago: MercadoPagoConfig;

/**
 * Configuração do MercadoPago
 */
export const configMercadoPago = (): MercadoPagoConfig => {
    try {
        // Inicializa o cliente do Mercado Pago
        mercadopago = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
        });

        logger.info("Mercado Pago configurado com sucesso");
        return mercadopago;
    } catch (error) {
        logger.error("Erro ao configurar Mercado Pago:", error);
        throw new Error("Falha na configuração do Mercado Pago");
    }
};

/**
 * Obtém instância do Mercado Pago, inicializando se necessário
 */
export const getMercadoPago = (): MercadoPagoConfig => {
    if (!mercadopago) {
        return configMercadoPago();
    }
    return mercadopago;
};

/**
 * Cria preferência de pagamento no Mercado Pago
 */
export const createPaymentPreference = async (
    items: Array<{
        id: string;
        title: string;
        quantity: number;
        unit_price: number;
        currency_id?: string;
        description?: string;
    }>,
    payer: {
        name: string;
        email: string;
    },
    externalReference: string,
    notificationUrl?: string,
) => {
    try {
        const client = getMercadoPago();
        const preference = new Preference(client);

        const preferenceData = {
            items: items.map((item) => ({
                ...item,
                currency_id: item.currency_id || "BRL",
            })),
            payer,
            external_reference: externalReference,
            back_urls: {
                success: `${process.env.WEBHOOK_BASE_URL}/api/payments/success`,
                failure: `${process.env.WEBHOOK_BASE_URL}/api/payments/failure`,
                pending: `${process.env.WEBHOOK_BASE_URL}/api/payments/pending`,
            },
            auto_return: "approved",
            notification_url:
                notificationUrl ||
                `${process.env.WEBHOOK_BASE_URL}/api/webhooks/mercadopago`,
            statement_descriptor: "Payment Automation",
        };

        const response = await preference.create({ body: preferenceData });
        return response;
    } catch (error) {
        logger.error("Erro ao criar preferência de pagamento:", error);
        throw error;
    }
};

/**
 * Busca informações de um pagamento pelo ID
 */
export const getPaymentById = async (paymentId: string) => {
    try {
        const client = getMercadoPago();
        const payment = new Payment(client);

        const response = await payment.get({ id: paymentId });
        return response;
    } catch (error) {
        logger.error(`Erro ao buscar pagamento ${paymentId}:`, error);
        throw error;
    }
};

export default {
    configMercadoPago,
    getMercadoPago,
    createPaymentPreference,
    getPaymentById,
};
