import { Payment, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type PaymentCreate = {
    orderId: string;
    externalId?: string;
    status?: PaymentStatus;
    amount: number | Decimal;
    paymentMethod?: string;
    paymentMethodId?: string;
    transactionDetails?: Record<string, unknown>;
};

export type PaymentUpdate = {
    status?: PaymentStatus;
    externalId?: string;
    transactionDetails?: Record<string, unknown>;
    notificationSent?: boolean;
};

export interface MercadoPagoPreference {
    id: string;
    init_point: string;
    sandbox_init_point: string;
    date_created: string;
    items: Array<{
        id: string;
        title: string;
        description?: string;
        picture_url?: string;
        category_id?: string;
        quantity: number;
        currency_id: string;
        unit_price: number;
    }>;
    // Outras propriedades conforme necessário
}

export interface MercadoPagoWebhookPayload {
    action: string;
    api_version: string;
    data: {
        id: string;
    };
    date_created: string;
    id: number;
    live_mode: boolean;
    type:
        | "payment"
        | "plan"
        | "subscription"
        | "invoice"
        | "point_integration_wh";
    user_id: string;
}

export { Payment, PaymentStatus };
