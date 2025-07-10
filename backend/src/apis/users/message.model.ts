import { sql } from '../../utils/database.utils.ts'
import { v4 as uuidv4 } from 'uuid'

// Send a message from one user to another
export async function sendMessage(senderId: string, receiverId: string, body: string) {
  const messageId = uuidv4()
  await sql`
    INSERT INTO message (message_id, message_sender_id, message_receiver_id, message_body, message_opened, message_sent_at)
    VALUES (${messageId}, ${senderId}, ${receiverId}, ${body}, false, NOW())
  `
  return messageId
}

// Get all messages between two users, ordered by sent time
export async function getConversation(userA: string, userB: string) {
  const rows = await sql`
    SELECT * FROM message
    WHERE (message_sender_id = ${userA} AND message_receiver_id = ${userB})
       OR (message_sender_id = ${userB} AND message_receiver_id = ${userA})
    ORDER BY message_sent_at ASC
  `
  return rows
}

// Mark all messages from sender to receiver as opened
export async function markMessagesAsRead(senderId: string, receiverId: string) {
  await sql`
    UPDATE message SET message_opened = true
    WHERE message_sender_id = ${senderId} AND message_receiver_id = ${receiverId} AND message_opened = false
  `
}

// Get all conversations for a user (latest message per user)
export async function getUserConversations(userId: string) {
  const rows = await sql`
    SELECT DISTINCT ON (other_user.user_id) m.*, other_user.user_name, other_user.user_img_url
    FROM message m
    JOIN "user" other_user ON (CASE WHEN m.message_sender_id = ${userId} THEN m.message_receiver_id ELSE m.message_sender_id END) = other_user.user_id
    WHERE m.message_sender_id = ${userId} OR m.message_receiver_id = ${userId}
    ORDER BY other_user.user_id, m.message_sent_at DESC
  `
  return rows
}

