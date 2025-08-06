import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils.ts'

export const GroupMessageSchema = z.object({
  groupMessageId: z.uuidv7('Please provide a valid UUIDv7 for groupMessageId'),
  groupMessageGroupId: z.uuidv7('Please provide a valid UUIDv7 for groupMessageGroupId'),
  groupMessageUserId: z.uuidv7('Please provide a valid UUIDv7 for groupMessageUserId'),
  groupMessageBody: z.string({ message: 'Please provide a valid groupMessageBody' })
    .min(1, 'Message must be at least 1 character')
    .max(1000, 'Message must be at most 1000 characters')
    .trim(),
  groupMessageSentAt: z.coerce.date({ message: 'Please provide a valid groupMessageSentAt date' })
})

export type GroupMessage = z.infer<typeof GroupMessageSchema>

export async function insertGroupMessage(groupMessage: Omit<GroupMessage, 'groupMessageSentAt'>): Promise<string> {
  const { groupMessageId, groupMessageGroupId, groupMessageUserId, groupMessageBody } = groupMessage
  await sql`
    INSERT INTO group_message (
      group_message_id,
      group_message_group_id,
      group_message_user_id,
      group_message_body,
      group_message_sent_at
    ) VALUES (
      ${groupMessageId},
      ${groupMessageGroupId},
      ${groupMessageUserId},
      ${groupMessageBody},
      NOW()
    )
  `
  return 'Group message created successfully'
}

export async function selectGroupMessagesByGroupId(groupId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT 
      gm.group_message_id as "groupMessageId",
      gm.group_message_group_id as "groupMessageGroupId",
      gm.group_message_user_id as "groupMessageUserId",
      gm.group_message_body as "groupMessageBody",
      gm.group_message_sent_at as "groupMessageSentAt",
      u.user_name as "userName",
      u.user_img_url as "userImgUrl"
    FROM group_message gm
    JOIN "user" u ON gm.group_message_user_id = u.user_id
    WHERE gm.group_message_group_id = ${groupId}
    ORDER BY gm.group_message_sent_at ASC
  `
  return rowList
}

export async function deleteGroupMessage(groupMessageId: string, userId: string): Promise<string> {
  // Only allow deletion if the user is the sender or admin of the group
  const result = await sql`
    DELETE FROM group_message 
    WHERE group_message_id = ${groupMessageId} 
    AND group_message_user_id = ${userId}
  `
  
  if (result.count === 0) {
    // Check if user is admin of the group
    const adminCheck = await sql`
      SELECT g.group_admin_user_id 
      FROM "group" g
      JOIN group_message gm ON g.group_id = gm.group_message_group_id
      WHERE gm.group_message_id = ${groupMessageId}
    `
    
    if (adminCheck.length > 0 && adminCheck[0].group_admin_user_id === userId) {
      await sql`
        DELETE FROM group_message 
        WHERE group_message_id = ${groupMessageId}
      `
      return 'Group message deleted by admin'
    }
    
    throw new Error('Unauthorized to delete this message')
  }
  
  return 'Group message deleted successfully'
}

export async function checkUserGroupMembership(userId: string, groupId: string): Promise<boolean> {
  const rowList = await sql`
    SELECT 1 FROM group_members 
    WHERE user_id = ${userId} AND group_id = ${groupId}
  `
  return rowList.length > 0
}

export async function checkUserGroupAdmin(userId: string, groupId: string): Promise<boolean> {
  const rowList = await sql`
    SELECT 1 FROM "group" 
    WHERE group_id = ${groupId} AND group_admin_user_id = ${userId}
  `
  return rowList.length > 0
}