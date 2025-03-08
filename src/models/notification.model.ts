export interface EmailNotification {
    to: string;
    subject: string;
    content: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }>;
}

export enum NotificationType {
    PAYMENT_CONFIRMATION = "payment_confirmation",
    PAYMENT_FAILURE = "payment_failure",
    ORDER_CREATED = "order_created",
    ORDER_STATUS_CHANGE = "order_status_change",
    WELCOME = "welcome",
}

export interface NotificationData {
    type: NotificationType;
    recipientEmail: string;
    recipientName?: string;
    subject?: string;
    templateData: Record<string, string | number | boolean>;
}

export interface NotificationResult {
    success: boolean;
    id?: string;
    error?: string;
}
