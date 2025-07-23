import * as z from "zod/v4"


export const UserInterestSchema = z.object({
    userInterestInterestId: z.uuidv7('please provide a valid uuidv7 for userInterestInterestId'),
    userInterestUserId: z.uuidv7('please provide a valid uuidv7 for userInterestUserId'),
})

export type UserInterest = z.infer<typeof UserInterestSchema>

export async function fetchPostUserInterestByUserId() {

}