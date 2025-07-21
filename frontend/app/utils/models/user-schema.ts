import {z} from "zod/v4";


export const UserSchema = z.object ({
    userId: z.uuid('Please provide a valid uuid for userId'),
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
    userCreated: z.coerce.date('Please provide a valid userCreated date')
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
export type User = z.infer<typeof UserSchema>