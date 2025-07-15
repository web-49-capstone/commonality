import{ z } from "zod/v4"
import { sql } from "../../utils/database.utils.ts"

export const MatchSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date')
})

export const MatchUserIdSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date'),
    userId: z.uuidv7('please provide a valid uuid7 for matchUserId'),
    userAvailability: z.string('Please provide valid availability')
        .max(127, 'Please provide a valid userAvailability (max 127 characters)')
        .trim()
        .nullable(),
    userBio: z.string('Please provide valid bio')
        .max(255, 'Please provide a valid userBio (max 255 characters)')
        .trim()
        .nullable(),
    userCity: z.string('Please provide valid city')
        .max(50, 'Please provide a valid userCity (max 50 characters)')
        .trim()
        .nullable(),
    userImgUrl: z.string('Please provide valid imgUrl')
        .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
        .trim(),
    userName: z.string('Please provide valid name')
        .min(1, 'Please provide a valid userName (min 1 characters)')
        .max(100, 'Please provide a valid userName (max 100 characters)')
        .trim(),
    userState: z.string('Please provide valid state')
        .length(2, 'Please provide a valid userState (max 2 characters)')
        .trim()
        .nullable(),
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
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created, user_id,  user_availability, user_bio, user_city, user_img_url, user_name, user_state FROM match INNER JOIN "user" ON (${userId} = match_maker_id OR ${userId} = match_receiver_id) WHERE match_accepted = ${matchAccepted} AND ( match_receiver_id = ${userId} OR match_maker_id = ${userId})`
    return MatchUserIdSchema.array().parse(rowList)
}

export async function updateMatch (matchMakerId: string, matchReceiverId: string, matchAccepted: boolean| null) : Promise<string> {
    const result = await sql `UPDATE match SET match_accepted = ${matchAccepted} WHERE match_maker_id = ${matchMakerId} AND match_receiver_id = ${matchReceiverId}`
    console.log(result)
    console.log(matchMakerId)
    return 'Match updated successfully'
}




