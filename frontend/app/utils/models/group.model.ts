import {z} from "zod/v4";

export const GroupSchema = z.object({
    groupId: z.uuidv7('Please provide a valid UUIDv7 for groupId'),
    groupName: z.string({ message: 'Please provide a valid groupName' }).max(100),
    groupAdminUserId: z.uuidv7('Please provide a valid UUIDv7 for groupAdminUserId'),
    groupDescription: z.string({ message: 'Please provide a valid groupDescription' }).max(500),
    groupSize: z.coerce.number({ message: 'Please provide a valid number for groupSize' }).int(),
    groupCreated: z.coerce.date({ message: 'Please provide a valid groupCreated date' }),
    groupUpdated: z.coerce.date({ message: 'Please provide a valid groupUpdated date' })
})