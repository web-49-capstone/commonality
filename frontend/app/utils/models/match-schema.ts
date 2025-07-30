import {z} from "zod/v4";

export const MatchSchema = z.object({
    matchMakerId: z.uuidv7('please provide a valid uuid7 for matchMakerId'),
    matchReceiverId: z.uuidv7('please provide a valid uuid7 for matchRecieverId'),
    matchAccepted: z.boolean('Please provide a valid matchAccepted boolean').nullable(),
    matchCreated: z.coerce.date('Please provide a valid matchCreated date')
})

export type Match = z.infer<typeof MatchSchema>