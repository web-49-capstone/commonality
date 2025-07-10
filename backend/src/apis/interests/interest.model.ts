import {z} from "zod/v4";
import {sql} from "../../utils/database.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";


export const InterestSchema = z.object({
    interestId: z.uuidv7('please provide a valid uuid7 for interestId'),
    interestName: z.string('name must be a string')
        .max(50, 'please keep it under 50 characters')
})

export const UserInterestSchema = z.object({
    userInterestInterestId: z.uuidv7('please provide a valid uuidv7 for userInterestInterestId'),
    userInterestUserId: z.uuidv7('please provide a valid uuidv7 for userInterestUserId'),
})

export type Interest = z.infer<typeof InterestSchema>
export type UserInterest = z.infer<typeof UserInterestSchema>

export async function insertInterest (interest: Interest): Promise<string> {
    const { interestId, interestName } = interest
    await sql`INSERT INTO interest(interest_id, interest_name) VALUES (${interestId}, ${interestName})`
    return 'Added a new interest to all interests'
}

export async function selectAllInterests (): Promise<Interest[]> {
    const result = await sql`SELECT interest_id, interest_name FROM interest`
    return InterestSchema.array().parse(result)
}

export async function selectInterestByInterestId (interestId: string): Promise<Interest|null> {

    const rowList = await sql`SELECT interest_id, interest_name FROM interest WHERE interest_id  = ${interestId} `
    const result = InterestSchema.array().max(1).parse(rowList)

    return result[0] ?? null
}

export async function selectInterestsByUserId (userInterestUserId: string): Promise<UserInterest[]> {
    const rowList = await sql`SELECT interest_id, interest_name FROM interest JOIN user_interest ON interest_id = user_interest.user_interest_interest_id WHERE user_interest.user_interest_user_id = ${userInterestUserId} `
    return UserInterestSchema.array().parse(rowList)
}