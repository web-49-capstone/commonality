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
    await sql`INSERT INTO message(message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at) VALUES (${messageId}, ${messageReceiverId}, ${messageSenderId}, ${messageBody}, ${messageOpened}, ${messageSentAt})`
    return 'Added a new message'
}

export async function selectMessagesByUserId(userId: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE message_receiver_id  = ${userId} OR message_sender_id = ${userId} ORDER BY message_sent_at DESC`
    return MessageSchema.array().parse(rowList)
}
export async function selectUnreadMessagesByUserId(userId: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE message_receiver_id  = ${userId} AND message_opened = false ORDER BY message_sent_at DESC`
    return MessageSchema.array().parse(rowList)
}

export const PartnerMessageSchema = z.object({
    message_id: z.uuidv7("please provide a valid uuid7 for messageId"),
    message_sender_id: z.uuidv7('please provide a valid uuid7 for messageSenderId'),
    message_receiver_id: z.uuidv7('please provide a valid uuid7 for messageReceiverId'),
    message_body: z.string('messageBody must be a string'),
    message_opened: z.boolean('messageOpened must be a boolean'),
    message_sent_at: z.coerce.date('please provide valid date'),
    partner_id: z.uuidv7('please provide a valid uuid7 for partnerId'),
    partner_name: z.string('partnerName must be a string'),
    partner_img:z.string('Please provide valid imgUrl')
        .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
        .trim()
        .nullable(),
});

export type PartnerMessage = z.infer<typeof PartnerMessageSchema>;

export async function selectLastMessagesWithPartnerInfo(userId: string): Promise<PartnerMessage[]> {
    const rows = await sql`
    SELECT DISTINCT ON (
      CASE 
        WHEN message_sender_id = ${userId} THEN message_receiver_id
        ELSE message_sender_id
      END
    )
    message_id,
    message_sender_id,
    message_receiver_id,
    message_body,
    message_opened,
    message_sent_at,
    u.user_id AS partner_id,
    u.user_name AS partner_name,
    u.user_img_url AS partner_img
    FROM message
    JOIN "user" u ON u.user_id = (
      CASE 
        WHEN message_sender_id = ${userId} THEN message_receiver_id
        ELSE message_sender_id
      END
    )
    WHERE message_sender_id = ${userId} OR message_receiver_id = ${userId}
    ORDER BY 
      CASE 
        WHEN message_sender_id = ${userId} THEN message_receiver_id
        ELSE message_sender_id
      END,
      message_sent_at DESC;
  `;

    return PartnerMessageSchema.array().parse(rows);
}