import{ z } from "zod/v4"
import { sql } from "../../utils/database.utils.ts"
import {type PublicUser, PublicUserSchema} from "../users/user.model.ts";

/**
 * Zod schema for validating Match objects.
 * - matchMakerId: must be a valid UUIDv7
 * - matchReceiverId: must be a valid UUIDv7
 * - matchAccepted: nullable boolean
 * - matchCreated: date
 */
export const MatchSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date')
})

/**
 * Type representing a Match object.
 */
export type Match = z.infer<typeof MatchSchema>

/**
 * Inserts a new match into the database.
 * @param match Match object to insert
 * @returns Success message
 */
export async function insertMatch (match: Match): Promise<string> {
    const { matchMakerId, matchReceiverId, matchAccepted, matchCreated } = match
    await sql`INSERT INTO match(match_maker_id, match_receiver_id, match_accepted, match_created) VALUES (${matchMakerId}, ${matchReceiverId}, ${matchAccepted}, now())`
    return 'Match added'
}

/**
 * Retrieves all accepted or declined matches for a user.
 * @param userId UUIDv7 of the user
 * @param matchAccepted Boolean or null to filter by accepted/declined/pending
 * @returns Array of PublicUser objects or null if none found
 */
export async function selectAcceptedMatchesByUserId (userId: string, matchAccepted: boolean | null): Promise<PublicUser[]|null>
{
    // Query users who have accepted/declined/pending matches with the given user
    const rowList = await sql`SELECT user_id, user_availability, user_bio, user_city, user_created, user_img_url, user_name, user_state FROM "user" INNER JOIN match ON (user_id = match_maker_id OR user_id = match_receiver_id) WHERE
    (
        ${matchAccepted === null
                ? sql`match_accepted IS NULL`
                : sql`match_accepted = ${matchAccepted}`
        }
    ) AND (match_receiver_id = ${userId} OR match_maker_id = ${userId}) AND user_id != ${userId}`
    return PublicUserSchema.array().parse(rowList)
}

/**
 * Updates the status of a match between two users.
 * @param matchMakerId UUIDv7 of the match maker
 * @param matchReceiverId UUIDv7 of the match receiver
 * @param matchAccepted Boolean or null for match status
 * @returns Success message
 */
export async function updateMatch (matchMakerId: string, matchReceiverId: string, matchAccepted: boolean| null) : Promise<string> {
    const result = await sql `UPDATE match SET match_accepted = ${matchAccepted} WHERE match_maker_id = ${matchMakerId} AND match_receiver_id = ${matchReceiverId}`
    return 'Match updated successfully'
}

/**
 * Retrieves all matches for a user (as maker or receiver).
 * @param userId UUIDv7 of the user
 * @returns Array of Match objects or null if none found
 */
export async function selectMatchesByUserId (userId: string): Promise<Match[]|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE match_maker_id = ${userId} OR match_receiver_id = ${userId}`
    return MatchSchema.array().parse(rowList)
}

/**
 * Retrieves all pending matches for a user (where match_accepted is null).
 * @param userId UUIDv7 of the user
 * @returns Array of Match objects or null if none found
 */
export async function selectPendingMatchesByUserId (userId: string): Promise<Match[]|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE match_receiver_id = ${userId} AND match_accepted IS NULL`
    return MatchSchema.array().parse(rowList)
}

/**
 * Checks if a pending match exists between two users.
 * @param matchReceiverId UUIDv7 of the receiver
 * @param matchMakerId UUIDv7 of the maker
 * @returns Match object or null if not found
 */
export async function checkIfMatchExistsBetweenTwoUsers (matchReceiverId: string, matchMakerId: string): Promise<Match|null> {
    const rowList = await sql`SELECT match_maker_id, match_receiver_id, match_accepted, match_created FROM match WHERE (match_receiver_id = ${matchReceiverId} AND match_maker_id = ${matchMakerId}) AND match_accepted IS NULL`
    const result = MatchSchema.array().parse(rowList)
    return result[0] ?? null
}