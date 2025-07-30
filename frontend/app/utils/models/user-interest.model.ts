import * as z from "zod/v4"
import type {Interest} from "~/utils/models/interest.model";


export const UserInterestSchema = z.object({
    userInterestInterestId: z.uuidv7('please provide a valid uuidv7 for userInterestInterestId'),
    userInterestUserId: z.uuidv7('please provide a valid uuidv7 for userInterestUserId'),
})

export type UserInterest = z.infer<typeof UserInterestSchema>

export async function fetchPostUserInterestByUserId(userId: string) {

    const {status, message} = await fetch(`${process.env.REST_API_URL}/interest/userInterestUserId`)
        .then (res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    return ({status, message})
}