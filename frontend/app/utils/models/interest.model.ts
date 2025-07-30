import * as z from "zod/v4";

export const InterestSchema = z.object({
    interestId: z.uuidv7('please provide a valid uuid7 for interestId'),
    interestName: z.string('name must be a string')
        .max(50, 'please keep it under 50 characters')
})
export type Interest = z.infer<typeof InterestSchema>

export async function fetchInterestsByInterestName (q: string | null): Promise<Interest[]> {
    if (!q) {
        return []
    }
    const {data: interests} = await fetch(`${process.env.REST_API_URL}/interest/interestByInterestName/${q}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('failed to fetch interests')
            }
            return res.json()
        })
    return InterestSchema.array().parse(interests)
}
