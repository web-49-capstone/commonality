import {PrivateUserSchema} from "../users/user.model.ts";
import {z} from "zod/v4";


export const SignUpUserSchema = PrivateUserSchema
.omit({userId: true, userActivationToken: true, userAvailability: true, userBio: true, userCity: true, userCreated: true, userHash: true, userImgUrl: true, userLat: true, userLng: true, userState: true })
.extend({
    userPasswordConfirm: z.string('User password confirmation must match password.')
        .min(8, 'Password must be at least 8 characters.')
        .max(32, 'Password must be at most 32 characters.'),
    userPassword:z.string ('User password must be at least 8 characters.')
        .min(8, 'Password must be at least 8 characters.')
        .max(32, 'Password must be at most 32 characters.')
})

.refine((data) => data.userPassword === data.userPasswordConfirm, {
    message: 'Passwords do not match.'
})