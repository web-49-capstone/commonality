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
    userLat: z.number('Please provide valid latitude')
        .min(-90, 'Please provide a valid userLat (min -90)')
        .max(90, 'Please provide a valid userLat (max 90)')
        .nullable(),
    userLng: z.number('Please provide valid longitude')
        .min(-180, 'Please provide a valid userLong (min -180)')
        .max(180, 'Please provide a valid userLong (max 180)')
        .nullable()
})

// export const UserMatchingSchema = z.object ({
//     userId: z.uuid('Please provide a valid uuid for userId'),
//     userAvailability: z.string('Please provide valid availability')
//         .max(127, 'Please provide a valid userAvailability (max 127 characters)')
//         .trim()
//         .nullable(),
//     userBio: z.string('Please provide valid bio')
//         .max(255, 'Please provide a valid userBio (max 255 characters)')
//         .trim()
//         .nullable(),
//     userCity: z.string('Please provide valid city')
//         .max(50, 'Please provide a valid userCity (max 50 characters)')
//         .trim()
//         .nullable(),
//     userCreated: z.coerce.date('Please provide a valid userCreated date')
//         .nullable(),
//     userImgUrl: z.string('Please provide valid imgUrl')
//         .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
//         .trim(),
//     userName: z.string('Please provide valid name')
//         .min(1, 'Please provide a valid userName (min 1 characters)')
//         .max(100, 'Please provide a valid userName (max 100 characters)')
//         .trim(),
//     userState: z.string('Please provide valid state')
//         .length(2, 'Please provide a valid userState (max 2 characters)')
//         .trim()
//         .nullable(),
//     userLat: z.number('Please provide valid latitude')
//         .min(-90, 'Please provide a valid userLat (min -90)')
//         .max(90, 'Please provide a valid userLat (max 90)')
//         .nullable(),
//     userLng: z.number('Please provide valid longitude')
//         .min(-180, 'Please provide a valid userLong (min -180)')
//         .max(180, 'Please provide a valid userLong (max 180)')
//         .nullable(),
//     userInterestInterestId: z.uuid('Please provide a valid uuid for userInterestInterestId'),
//
// })

export type User = z.infer<typeof UserSchema>
// export type UserMatching = z.infer<typeof UserMatchingSchema>