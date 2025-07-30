import{ z } from "zod/v4"
import { sql } from "../../utils/database.utils.ts"
import {type PublicUser, PublicUserSchema} from "../users/user.model.ts";

export const MatchSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date')
})

export type Match = z.infer<typeof MatchSchema>
export async function insertMatch (match: Match): Promise<string> {
    const { matchMakerId, matchReceiverId, matchAccepted, matchCreated } = match
    await sql`INSERT INTO match(match_maker_id, match_receiver_id, match_accepted, match_created) VALUES (${matchMakerId}, ${matchReceiverId}, ${matchAccepted}, now())`
    return 'Match added'
}

// export async function selectAllMatches (): Promise<Match[]> {
//     const result = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match`
//     return MatchSchema.array().parse(result)
// }

export async function selectAcceptedMatchesByUserId (userId: string, matchAccepted: boolean | null): Promise<PublicUser[]|null>
{
    const rowList = await sql`SELECT user_id, user_availability, user_bio, user_city, user_created, user_img_url, user_name, user_state FROM "user" INNER JOIN match ON (user_id = match_maker_id OR user_id = match_receiver_id) WHERE
    (
        ${matchAccepted === null
                ? sql`match_accepted IS NULL`
                : sql`match_accepted = ${matchAccepted}`
        }
    ) AND (match_receiver_id = ${userId} OR match_maker_id = ${userId}) AND user_id != ${userId}`
    return PublicUserSchema.array().parse(rowList)
}

export async function updateMatch (matchMakerId: string, matchReceiverId: string, matchAccepted: boolean| null) : Promise<string> {
    const result = await sql `UPDATE match SET match_accepted = ${matchAccepted} WHERE match_maker_id = ${matchMakerId} AND match_receiver_id = ${matchReceiverId}`
    console.log(result)
    console.log(matchMakerId)
    return 'Match updated successfully'
}

//select all matches for a user whether they are receiver or maker
export async function selectMatchesByUserId (userId: string): Promise<Match[]|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE match_maker_id = ${userId} OR match_receiver_id = ${userId}`
    return MatchSchema.array().parse(rowList)
}


export async function selectPendingMatchesByUserId (userId: string): Promise<Match[]|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE match_receiver_id = ${userId} AND match_accepted IS NULL`
    return MatchSchema.array().parse(rowList)
}

export async function checkIfMatchExistsBetweenTwoUsers (matchReceiverId: string, matchMakerId: string): Promise<Match|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE (match_receiver_id = ${matchReceiverId} AND match_maker_id = ${matchMakerId}) AND match_accepted IS NULL`
    const result = MatchSchema.array().parse(rowList)
    return result[0] ?? null
}