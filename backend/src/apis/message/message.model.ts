import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";

/**
 * Zod schema for validating Message objects.
 * - messageId: must be a valid UUIDv7
 * - messageReceiverId: must be a valid UUIDv7
 * - messageSenderId: must be a valid UUIDv7
 * - messageBody: string, 1-1000 characters
 * - messageOpened: boolean
 * - messageSentAt: date
 */
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

/**
 * Zod schema for validating userId for message queries.
 * - userId: must be a valid UUIDv7
 */
export const MessageUserIdSchema = z.object({
    userId: z.uuidv7("please provide a valid uuid7 for messageId"),
})

/**
 * Type representing a Message object.
 */
export type Message = z.infer<typeof MessageSchema>

/**
 * Inserts a new message into the database.
 * @param message Message object to insert
 * @returns Success message
 */
export async function insertMessage(message: Message): Promise<string> {
    const { messageId, messageReceiverId, messageSenderId, messageBody, messageOpened, messageSentAt } = message
    await sql`INSERT INTO message(message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at) VALUES (${messageId}, ${messageReceiverId}, ${messageSenderId}, ${messageBody}, ${messageOpened}, now())`
    return 'Added a new message'
}

/**
 * Updates message status to opened for a given sender and receiver.
 * @param userIdFromSession UUIDv7 of the receiver (from session)
 * @param userId UUIDv7 of the sender
 * @returns Success message
 */
export async function updateMessageWhenOpened(userIdFromSession: string, userId: string): Promise<string> {
    await sql`UPDATE message SET message_opened = true WHERE message_sender_id = ${userId} AND message_receiver_id = ${userIdFromSession} AND message_opened = false`
    return 'Updated message'
}

/**
 * Deletes a message from the database.
 * @param messageId UUIDv7 of the message
 * @returns Success message
 */
export async function deleteMessage(messageId: string): Promise<string> {
    await sql`DELETE FROM message WHERE message_id = ${messageId}`
    return 'Deleted message'
}

/**
 * Retrieves all messages exchanged between two users, ordered by sent time.
 * @param userId1 UUIDv7 of one user
 * @param userId2 UUIDv7 of the other user
 * @returns Array of Message objects
 */
export async function selectMessagesBySenderAndReceiver(userId1: string, userId2: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE (message_receiver_id = ${userId1} AND message_sender_id = ${userId2}) OR (message_receiver_id = ${userId2} AND message_sender_id = ${userId1}) ORDER BY message_sent_at ASC`
    return MessageSchema.array().parse(rowList)
}

/**
 * Retrieves all unread messages for a user, ordered by sent time descending.
 * @param userId UUIDv7 of the receiver
 * @returns Array of Message objects
 */
export async function selectUnreadMessagesByUserId(userId: string): Promise<Message[]> {
    const rowList = await sql`SELECT message_id, message_receiver_id, message_sender_id, message_body, message_opened, message_sent_at FROM message WHERE message_receiver_id  = ${userId} AND message_opened = false ORDER BY message_sent_at DESC`
    return MessageSchema.array().parse(rowList)
}

/**
 * Zod schema for validating PartnerMessage objects.
 * - messageId: must be a valid UUIDv7
 * - messageSenderId: must be a valid UUIDv7
 * - messageReceiverId: must be a valid UUIDv7
 * - messageBody: string
 * - messageOpened: boolean
 * - messageSentAt: date
 * - partnerId: must be a valid UUIDv7
 * - partnerName: string
 * - partnerImg: string, max 255 characters
 */
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

/**
 * Type representing a PartnerMessage object.
 */
export type PartnerMessage = z.infer<typeof PartnerMessageSchema>;

/**
 * Retrieves the last message with partner information for each partner of a user.
 * @param userId UUIDv7 of the user
 * @returns Array of PartnerMessage objects
 */
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

    return PartnerMessageSchema.array().parse(rows);
}
