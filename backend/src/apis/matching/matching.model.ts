import{ z } from "zod/v4"
import { sql } from "../../utils/database.utils.ts"

export const MatchSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date')
})

export const MatchUserIdSchema = z.object({
    userId: z.uuidv7('please provide a valid uuid7 for matchUserId'),
})
export type Match = z.infer<typeof MatchSchema>
export type MatchUserIdSchema = z.infer<typeof MatchUserIdSchema>
export async function insertMatch (match: Match): Promise<string> {
    const { matchMakerId, matchReceiverId, matchAccepted, matchCreated } = match
    await sql`INSERT INTO match(match_maker_id, match_receiver_id, match_accepted, match_created) VALUES (${matchMakerId}, ${matchReceiverId}, ${matchAccepted}, now())`
    return 'Match added'
}

// export async function selectAllMatches (): Promise<Match[]> {
//     const result = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match`
//     return MatchSchema.array().parse(result)
// }

export async function selectAcceptedMatchesByUserId (userId: string, matchAccepted: boolean | null): Promise<Match[]|null>
{
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE match_accepted = ${matchAccepted} AND ( match_receiver_id = ${userId} OR match_maker_id = ${userId})`
    return MatchSchema.array().parse(rowList)
}

export async function updateMatch (matchMakerId: string, matchReceiverId: string) : Promise<string> {
    await sql `UPDATE match SET match_accepted = true WHERE match_maker_id = ${matchMakerId} AND match_receiver_id = ${matchReceiverId}`
    return 'Match updated successfully'
}



