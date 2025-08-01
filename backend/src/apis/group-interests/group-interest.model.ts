import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";
import {type Interest, InterestSchema} from "../interests/interest.model.ts";

export const GroupInterestSchema = z.object({
    groupInterestGroupId: z.uuidv7('please provide a valid uuidv7 for groupInterestGroupId'),
    groupInterestInterestId: z.uuidv7('please provide a valid uuidv7 for groupInterestInterestId')
})

export type GroupInterest = z.infer<typeof GroupInterestSchema>

export async function insertGroupInterest (groupInterest: GroupInterest): Promise<string> {
    const { groupInterestGroupId, groupInterestInterestId } = groupInterest
    await sql`INSERT INTO group_interest(group_interest_group_id, group_interest_interest_id) VALUES (${groupInterestGroupId}, ${groupInterestInterestId})`
    return 'Added a new interest to group interests'
}

export async function selectGroupInterestByGroupInterest(groupInterest: GroupInterest): Promise<GroupInterest|null> {
    const { groupInterestGroupId, groupInterestInterestId } = groupInterest
    const rowList = await sql`SELECT group_interest_group_id, group_interest_interest_id FROM group_interest WHERE group_interest_group_id = ${groupInterestGroupId} AND group_interest_interest_id = ${groupInterestInterestId}`
    const result = GroupInterestSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

export async function deleteGroupInterest (groupInterest: GroupInterest): Promise<string> {
    const { groupInterestGroupId, groupInterestInterestId } = groupInterest
    await sql`DELETE FROM group_interest WHERE group_interest_group_id = ${groupInterestGroupId} AND group_interest_interest_id = ${groupInterestInterestId}`
    return 'Deleted interest from group interests'
}
export async function selectInterestsByGroupId (groupInterestGroupId: string): Promise<Interest[]> {
    const rowList = await sql`SELECT interest_id, interest_name FROM interest JOIN group_interest ON interest_id = group_interest.group_interest_interest_id WHERE group_interest.group_interest_group_id = ${groupInterestGroupId} `
    return InterestSchema.array().parse(rowList)
}