export interface Message {
    messageId: string;
    messageSenderId: string;
    messageReceiverId: string;
    messageBody: string;
    messageOpened: boolean;
    messageSentAt: string;
}