import { z } from 'zod/v4'
import { sql } from '../../utils/database.utils.ts'


export const GroupSchema = z.object({
  groupId: z.uuidv7('Please provide a valid UUIDv7 for groupId'),
  groupName: z.string({ message: 'Please provide a valid groupName' }).max(100),
  groupAdminUserId: z.uuidv7('Please provide a valid UUIDv7 for groupAdminUserId'),
  groupDescription: z.string({ message: 'Please provide a valid groupDescription' }).max(500),
  groupSize: z.coerce.number({ message: 'Please provide a valid number for groupSize' }).int(),
  groupCreated: z.coerce.date({ message: 'Please provide a valid groupCreated date' }),
  groupUpdated: z.coerce.date({ message: 'Please provide a valid groupUpdated date' })
})

export const GroupCreationSchema = GroupSchema.omit({
  groupId: true,
  groupCreated: true,
  groupUpdated: true
})

export const GroupInterestSchema = z.object({
  interestId: z.uuidv7('Please provide a valid UUIDv7 for interestId'),
  groupId: z.uuidv7('Please provide a valid UUIDv7 for groupId')
})

export const GroupMemberSchema = z.object({
  userId: z.uuidv7('Please provide a valid UUIDv7 for userId'),
  groupId: z.uuidv7('Please provide a valid UUIDv7 for groupId')
})

export type Group = z.infer<typeof GroupSchema>
export type GroupInterest = z.infer<typeof GroupInterestSchema>
export type GroupMember = z.infer<typeof GroupMemberSchema>
export const GroupIdSchema = z.object({
  groupId: z.uuidv7('Please provide a valid UUIDv7 for groupId')
})

export async function createGroup(group: Omit<Group,'groupCreated' | 'groupUpdated'>): Promise<string> {


    const {groupId, groupName, groupAdminUserId, groupDescription, groupSize } = group

    const result = await sql`
      INSERT INTO "group" (
        group_id,
        group_name,
        group_admin_user_id,
        group_description,
        group_size,
        group_created,
        group_updated
      ) VALUES (
        ${groupId},
        ${groupName},
        ${groupAdminUserId},
        ${groupDescription},
        ${groupSize},
        NOW(),
        NOW()
      ) RETURNING group_id
    `

    // Add the admin as a member of the group
    await sql`
      INSERT INTO group_members (
        group_id,
        user_id
      ) VALUES (
        ${groupId},
        ${groupAdminUserId}
      )
    `

return 'Group created successfully with ID'
}

export async function updateGroup(group: Omit<Group, 'groupCreated' | 'groupUpdated'>): Promise<string> {
  const { groupId, groupName, groupAdminUserId, groupDescription, groupSize } = group
  await sql`
    UPDATE "group"
    SET
      group_name = ${groupName},
      group_admin_user_id = ${groupAdminUserId},
      group_description = ${groupDescription},
      group_size = ${groupSize},
      group_updated = NOW()
    WHERE group_id = ${groupId}
  `
  return 'Group updated successfully'
}

export async function deleteGroup(groupId: string): Promise<string> {
  await sql`DELETE FROM "group" WHERE group_id = ${groupId}`
  return 'Group deleted successfully'
}

export async function addGroupMember(groupMember: GroupMember): Promise<string> {
  const { userId, groupId } = groupMember
  await sql`
    INSERT INTO group_members (user_id, group_id)
    VALUES (${userId}, ${groupId})
  `
  return 'Member added successfully'
}

export async function addGroupInterest(groupId: string, interestId: string): Promise<string> {
  console.log(`Inserting interest ${interestId} into group ${groupId}`)
  await sql`
    INSERT INTO group_interests (group_id, interest_id)
    VALUES (${groupId}, ${interestId})
  `
  return 'Interest added to group successfully'
}

export async function removeGroupMember(groupMember: GroupMember): Promise<string> {
  const { userId, groupId } = groupMember
  await sql`
    DELETE FROM group_members
    WHERE user_id = ${userId} AND group_id = ${groupId}
  `
  return 'Member removed successfully'
}

export async function searchGroups(query: string): Promise<Group[]> {
  const rowList = await sql<Group[]>`
    SELECT *
    FROM "group"
    WHERE group_name ILIKE ${'%' + query + '%'}
       OR group_description ILIKE ${'%' + query + '%'}
  `
  return GroupSchema.array().parse(rowList)
}

export async function findGroupsByInterest(interestId: string): Promise<Group[]> {
  const rowList = await sql<Group[]>`
    SELECT g.*
    FROM "group" g
           JOIN group_interests gi ON g.group_id = gi.group_id
    WHERE gi.interest_id = ${interestId}
  `
  return GroupSchema.array().parse(rowList)
}

export async function findMatchingGroups(userId: string): Promise<Group[]> {
  const rowList = await sql<Group[]>`
    SELECT g.*
    FROM "group" g
           JOIN group_interests gi ON g.group_id = gi.group_id
           JOIN user_interest ui ON gi.interest_id = ui.user_interest_interest_id
    WHERE ui.user_interest_user_id = ${userId}
  `
  return GroupSchema.array().parse(rowList)
}

export async function selectGroupById(groupId: string): Promise<any | null> {
  // Fetch group details
  const rowList = await sql<Group[]>`
    SELECT *
    FROM "group"
    WHERE group_id = ${groupId}
  `
  const group = GroupSchema.array().max(1).parse(rowList)[0]
  if (!group) return null;

  // Fetch group members with user info
  const members = await sql`
    SELECT u.user_id as "userId", u.user_name as "userName"
    FROM group_members gm
    JOIN "user" u ON gm.user_id = u.user_id
    WHERE gm.group_id = ${groupId}
  `

  // Fetch group interests (optional, for completeness)
  const interests = await sql`
    SELECT i.interest_id as "interestId", i.interest_name as "interestName"
    FROM group_interests gi
    JOIN interest i ON gi.interest_id = i.interest_id
    WHERE gi.group_id = ${groupId}
  `

  return {
    ...group,
    members,
    interests
  }
}

export async function selectGroupsByUserId(userId: string): Promise<Group[]> {
  const rowList = await sql`
    SELECT g.*
    FROM "group" g
           JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.user_id = ${userId}
  `
  console.log(rowList)
  return GroupSchema.array().parse(rowList)
}