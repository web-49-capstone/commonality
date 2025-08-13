import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";


/**
 * Zod schema for validating Interest objects.
 * - interestId: must be a valid UUIDv7
 * - interestName: string, max 50 characters
 */
export const InterestSchema = z.object({
    interestId: z.uuidv7('please provide a valid uuid7 for interestId'),
    interestName: z.string('name must be a string')
        .max(50, 'please keep it under 50 characters')
})

/**
 * Zod schema for validating UserInterest objects.
 * - userInterestInterestId: must be a valid UUIDv7
 * - userInterestUserId: must be a valid UUIDv7
 */
export const UserInterestSchema = z.object({
    userInterestInterestId: z.uuidv7('please provide a valid uuidv7 for userInterestInterestId'),
    userInterestUserId: z.uuidv7('please provide a valid uuidv7 for userInterestUserId'),
})

/**
 * Type representing an Interest object.
 */
export type Interest = z.infer<typeof InterestSchema>
/**
 * Type representing a UserInterest object.
 */
export type UserInterest = z.infer<typeof UserInterestSchema>

/**
 * Inserts a new interest into the database.
 * @param interest Interest object to insert
 * @returns Success message
 */
export async function insertInterest (interest: Interest): Promise<string> {
    const { interestId, interestName } = interest
    await sql`INSERT INTO interest(interest_id, interest_name) VALUES (${interestId}, ${interestName})`
    return 'Added a new interest to all interests'
}

/**
 * Retrieves all interests from the database.
 * @returns Array of Interest objects
 */
export async function selectAllInterests (): Promise<Interest[]> {
    const result = await sql`SELECT interest_id, interest_name FROM interest`
    return InterestSchema.array().parse(result)
}

/**
 * Retrieves interests by name (case-insensitive, starts with).
 * @param interestName Name to search for
 * @returns Array of Interest objects or null if none found
 */
export async function selectInterestsByInterestName (interestName: string): Promise<Interest[]|null> {
    const rowList = await sql`SELECT interest_id, interest_name FROM interest WHERE interest_name ILIKE ${interestName + '%'}`
    return InterestSchema.array().parse(rowList) ?? null
}

/**
 * Retrieves a single interest by its ID.
 * @param interestId UUIDv7 of the interest
 * @returns Interest object or null if not found
 */
export async function selectInterestByInterestId (interestId: string): Promise<Interest|null> {

    const rowList = await sql`SELECT interest_id, interest_name FROM interest WHERE interest_id  = ${interestId} `
    const result = InterestSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}

/**
 * Retrieves all interests for a given user ID.
 * @param userInterestUserId UUIDv7 of the user
 * @returns Array of Interest objects
 */
export async function selectInterestsByUserId (userInterestUserId: string): Promise<Interest[]> {
    const rowList = await sql`SELECT interest_id, interest_name FROM interest JOIN user_interest ON interest_id = user_interest.user_interest_interest_id WHERE user_interest.user_interest_user_id = ${userInterestUserId} `
    return InterestSchema.array().parse(rowList)
}

/**
 * Inserts a new user interest into the database.
 * @param userInterest UserInterest object to insert
 * @returns Success message
 */
export async function insertUserInterestInterestId (userInterest: UserInterest): Promise<string> {

    const { userInterestInterestId, userInterestUserId } = userInterest
    await sql`INSERT INTO user_interest(user_interest_interest_id, user_interest_user_id) VALUES (${userInterestInterestId}, ${userInterestUserId})`
    return 'Added a new interest to user interests'
}

/**
 * Retrieves a user interest by its composite keys.
 * @param userInterest UserInterest object (interestId and userId)
 * @returns UserInterest object or null if not found
 */
export async function selectUserInterestByUserInterest(userInterest: UserInterest): Promise<UserInterest|null> {
    const { userInterestInterestId, userInterestUserId } = userInterest
    const rowList = await sql`SELECT user_interest_interest_id, user_interest_user_id FROM user_interest WHERE user_interest_interest_id = ${userInterestInterestId} AND user_interest_user_id = ${userInterestUserId}`
    const result = UserInterestSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

/**
 * Deletes a user interest from the database.
 * @param userInterest UserInterest object (interestId and userId)
 * @returns Success message
 */
export async function deleteUserInterest (userInterest: UserInterest): Promise<string> {
    const { userInterestInterestId, userInterestUserId } = userInterest
    await sql`DELETE FROM user_interest WHERE user_interest_interest_id = ${userInterestInterestId} AND user_interest_user_id = ${userInterestUserId}`
    return 'Deleted interest from user interests'
}