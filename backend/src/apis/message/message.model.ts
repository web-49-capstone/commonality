import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";

export const MessageSchema = z.object({
    messageId: z.uuidv7("please provide a valid uuid7 for messageId"),
    messageReceiverId: z.uuidv7("please provide a valid uuid7 for messageReceiverId"),
    messageSenderId: z.uuidv7("please provide a valid uuid7 for messageSenderId"),
    messageBody: z.string("messageBody must be a string")
        .min(1, "messageBody must be at least 1 character")
        .max(1000, "messageBody must be at most 1000 characters")
        .trim(),
    messageOpened: z.boolean("messageOpened must be a boolean"),
    messageSentAt: z.coerce.date("please provide a valid date string for messageSentAt"),
})
export const MessageUserIdSchema = z.object({
    userId: z.uuidv7("please provide a valid uuid7 for messageId"),
})
export type Message = z.infer<typeof MessageSchema>

export async function insertMessage(message: Message): Promise<string> {
    const { messageId, messageReceiverId, messageSenderId, messageBody, messageOpened, messageSentAt } = message
    await sql`INSERT INTO message(message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at) VALUES (${messageId}, ${messageReceiverId}, ${messageSenderId}, ${messageBody}, ${messageOpened}, now())`
    return 'Added a new message'
}

export async function updateMessageWhenOpened(userIdFromSession: string, userId: string): Promise<string> {
    await sql`UPDATE message SET message_opened = true WHERE message_sender_id = ${userId} AND message_receiver_id = ${userIdFromSession} AND message_opened = false`
    return 'Updated message'
}

export async function deleteMessage(messageId: string): Promise<string> {
    await sql`DELETE FROM message WHERE message_id = ${messageId}`
    return 'Deleted message'
}

// export async function selectMessagesByUserId(userId: string): Promise<Message[]> {
//     const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE message_receiver_id = ${userId} OR message_sender_id = ${userId} ORDER BY message_sent_at DESC`
//     return MessageSchema.array().parse(rowList)
// }

export async function selectMessagesBySenderAndReceiver(userId1: string, userId2: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE (message_receiver_id = ${userId1} AND message_sender_id = ${userId2}) OR (message_receiver_id = ${userId2} AND message_sender_id = ${userId1}) ORDER BY message_sent_at ASC`
    return MessageSchema.array().parse(rowList)
}


export async function selectUnreadMessagesByUserId(userId: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE message_receiver_id  = ${userId} AND message_opened = false ORDER BY message_sent_at DESC`
    return MessageSchema.array().parse(rowList)
}

export const PartnerMessageSchema = z.object({
    messageId: z.uuidv7("please provide a valid uuid7 for messageId"),
    messageSenderId: z.uuidv7('please provide a valid uuid7 for messageSenderId'),
    messageReceiverId: z.uuidv7('please provide a valid uuid7 for messageReceiverId'),
    messageBody: z.string('messageBody must be a string'),
    messageOpened: z.boolean('messageOpened must be a boolean'),
    messageSentAt: z.coerce.date('please provide valid date'),
    partnerId: z.uuidv7('please provide a valid uuid7 for partnerId'),
    partnerName: z.string('partnerName must be a string'),
    partnerImg:z.string('Please provide valid imgUrl')
        .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
        .trim()
        .nullable(),
});

export type PartnerMessage = z.infer<typeof PartnerMessageSchema>;

export async function selectLastMessagesWithPartnerInfo(userId: string): Promise<PartnerMessage[]> {
    const rows = await sql`
        WITH partner_messages AS (
            SELECT
                message_id,
                message_sender_id,
                message_receiver_id,
                message_body,
                message_opened,
                message_sent_at,
                CASE
                    WHEN message_sender_id = ${userId} THEN message_receiver_id
                    ELSE message_sender_id
                    END AS partner_id
            FROM message
            WHERE message_sender_id = ${userId} OR message_receiver_id = ${userId}
        )
        SELECT DISTINCT ON (partner_id)
            message_id,
            message_sender_id,
            message_receiver_id,
            message_body,
            message_opened,
            message_sent_at,
            u.user_id::text AS partner_id,
            u.user_name::text AS partner_name,
            u.user_img_url::text AS partner_img
        FROM partner_messages
                 JOIN "user" u ON u.user_id = partner_messages.partner_id
        ORDER BY partner_id, message_sent_at DESC;
    `;

    console.log("Returned message rows:", rows);
    return PartnerMessageSchema.array().parse(rows);
}

