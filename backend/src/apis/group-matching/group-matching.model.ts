import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils.ts'

export const GroupMatchSchema = z.object({
  groupMatchUserId: z.uuidv7('Please provide a valid UUIDv7 for groupMatchUserId'),
  groupMatchGroupId: z.uuidv7('Please provide a valid UUIDv7 for groupMatchGroupId'),
  groupMatchAccepted: z.boolean({ message: 'Please provide a valid boolean for groupMatchAccepted' }),
  groupMatchCreated: z.coerce.date({ message: 'Please provide a valid groupMatchCreated date' })
})

export type GroupMatch = z.infer<typeof GroupMatchSchema>

export async function insertGroupMatch(groupMatch: Omit<GroupMatch, 'groupMatchCreated'>): Promise<string> {
  const { groupMatchUserId, groupMatchGroupId, groupMatchAccepted } = groupMatch
  await sql`
    INSERT INTO group_match (
      group_match_user_id,
      group_match_group_id,
      group_match_accepted,
      group_match_created
    ) VALUES (
      ${groupMatchUserId},
      ${groupMatchGroupId},
      ${groupMatchAccepted},
      NOW()
    )
  `
  return 'Group match created successfully'
}

export async function updateGroupMatch(userId: string, groupId: string, accepted: boolean): Promise<string> {
  await sql`
    UPDATE group_match
    SET group_match_accepted = ${accepted}
    WHERE group_match_user_id = ${userId} AND group_match_group_id = ${groupId}
  `
  return 'Group match updated successfully'
}

export async function selectPendingGroupMatchesByGroupId(groupId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT 
      gm.*,
      u.user_id as "userId",
      u.user_name as "userName",
      u.user_bio as "userBio",
      u.user_img_url as "userImgUrl",
      u.user_city as "userCity",
      u.user_state as "userState",
      array_agg(i.interest_name) as "sharedInterests"
    FROM group_match gm
    JOIN "user" u ON gm.group_match_user_id = u.user_id
    JOIN user_interest ui ON u.user_id = ui.user_interest_user_id
    JOIN group_interests gi ON gm.group_match_group_id = gi.group_id AND ui.user_interest_interest_id = gi.interest_id
    JOIN interest i ON gi.interest_id = i.interest_id
    WHERE gm.group_match_group_id = ${groupId} 
      AND gm.group_match_accepted IS NULL
    GROUP BY gm.group_match_user_id, gm.group_match_group_id, gm.group_match_accepted, gm.group_match_created, u.user_id, u.user_name, u.user_bio, u.user_img_url, u.user_city, u.user_state
  `
  return rowList
}

export async function selectPendingGroupMatchesByUserId(userId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT 
      gm.*,
      g.group_id as "groupId",
      g.group_name as "groupName",
      g.group_description as "groupDescription",
      g.group_size as "groupSize",
      array_agg(i.interest_name) as "sharedInterests",
      u.user_name as "adminName"
    FROM group_match gm
    JOIN "group" g ON gm.group_match_group_id = g.group_id
    JOIN "user" u ON g.group_admin_user_id = u.user_id
    JOIN group_interests gi ON g.group_id = gi.group_id
    JOIN user_interest ui ON gm.group_match_user_id = ui.user_interest_user_id AND gi.interest_id = ui.user_interest_interest_id
    JOIN interest i ON gi.interest_id = i.interest_id
    WHERE gm.group_match_user_id = ${userId} 
      AND gm.group_match_accepted IS NULL
    GROUP BY gm.group_match_user_id, gm.group_match_group_id, gm.group_match_accepted, gm.group_match_created, g.group_id, g.group_name, g.group_description, g.group_size, u.user_name
  `
  return rowList
}

export async function selectAcceptedGroupMatchesByGroupId(groupId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT 
      gm.*,
      u.user_id as "userId",
      u.user_name as "userName",
      u.user_bio as "userBio",
      u.user_img_url as "userImgUrl",
      u.user_city as "userCity",
      u.user_state as "userState",
      array_agg(i.interest_name) as "sharedInterests"
    FROM group_match gm
    JOIN "user" u ON gm.group_match_user_id = u.user_id
    JOIN user_interest ui ON u.user_id = ui.user_interest_user_id
    JOIN group_interests gi ON gm.group_match_group_id = gi.group_id AND ui.user_interest_interest_id = gi.interest_id
    JOIN interest i ON gi.interest_id = i.interest_id
    WHERE gm.group_match_group_id = ${groupId} 
      AND gm.group_match_accepted = true
    GROUP BY gm.group_match_user_id, gm.group_match_group_id, gm.group_match_accepted, gm.group_match_created, u.user_id, u.user_name, u.user_bio, u.user_img_url, u.user_city, u.user_state
  `
  return rowList
}

export async function selectAcceptedGroupMatchesByUserId(userId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT 
      gm.*,
      g.group_id as "groupId",
      g.group_name as "groupName",
      g.group_description as "groupDescription",
      g.group_size as "groupSize",
      array_agg(i.interest_name) as "sharedInterests",
      u.user_name as "adminName"
    FROM group_match gm
    JOIN "group" g ON gm.group_match_group_id = g.group_id
    JOIN "user" u ON g.group_admin_user_id = u.user_id
    JOIN group_interests gi ON g.group_id = gi.group_id
    JOIN user_interest ui ON gm.group_match_user_id = ui.user_interest_user_id AND gi.interest_id = ui.user_interest_interest_id
    JOIN interest i ON gi.interest_id = i.interest_id
    WHERE gm.group_match_user_id = ${userId} 
      AND gm.group_match_accepted = true
    GROUP BY gm.group_match_user_id, gm.group_match_group_id, gm.group_match_accepted, gm.group_match_created, g.group_id, g.group_name, g.group_description, g.group_size, u.user_name
  `
  return rowList
}

export async function findMatchingGroupsByUserId(userId: string): Promise<any[]> {
  const rowList = await sql`
    SELECT DISTINCT
      g.group_id as "groupId",
      g.group_name as "groupName",
      g.group_description as "groupDescription",
      g.group_size as "groupSize",
      u.user_name as "adminName",
      u.user_id as "adminUserId",
      array_agg(i.interest_name) as "sharedInterests",
      COUNT(DISTINCT gm.group_match_user_id) as "memberCount"
    FROM "group" g
    JOIN "user" u ON g.group_admin_user_id = u.user_id
    JOIN group_interests gi ON g.group_id = gi.group_id
    JOIN user_interest ui ON gi.interest_id = ui.user_interest_interest_id
    JOIN interest i ON gi.interest_id = i.interest_id
    LEFT JOIN group_members gm ON g.group_id = gm.group_id
    WHERE ui.user_interest_user_id = ${userId}
      AND g.group_admin_user_id != ${userId}
      AND NOT EXISTS (
        SELECT 1 FROM group_match gm2 
        WHERE gm2.group_match_user_id = ${userId} 
          AND gm2.group_match_group_id = g.group_id
      )
    GROUP BY g.group_id, g.group_name, g.group_description, g.group_size, u.user_name, u.user_id
    ORDER BY sharedInterests DESC
    LIMIT 10
  `
  return rowList
}

export async function checkIfGroupMatchExists(userId: string, groupId: string): Promise<boolean> {
  const rowList = await sql`
    SELECT 1 FROM group_match 
    WHERE group_match_user_id = ${userId} AND group_match_group_id = ${groupId}
  `
  return rowList.length > 0
}