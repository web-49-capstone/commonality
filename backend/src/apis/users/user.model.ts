import { z } from 'zod/v4'
import {sql} from "../../utils/database.utils.ts";
import {type Interest, InterestSchema} from "../interests/interest.model.ts";

export const PrivateUserSchema = z.object ({
    userId: z.uuid('Please provide a valid uuid for userId'),
    userActivationToken: z.string('Please provide valid activation token')
        .length(32, 'Please provide a valid userActivationToken (32 characters)')
        .nullable(),
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
    userEmail: z.email('Please provide valid email address')
        .max(128, 'Please provide a valid userEmail (max 128 characters)'),
    userHash: z.string('Please provide valid hash')
        .length(97, 'Please provide a valid userHash (97 characters)'),
    userImgUrl: z.string('Please provide valid imgUrl')
        .max(255, 'Please provide a valid userImgUrl (max 255 characters)')
        .trim(),
    userLat: z.coerce.number('Please provide valid latitude')
        .min(-90, 'Please provide a valid userLat (min -90)')
        .max(90, 'Please provide a valid userLat (max 90)')
        .nullable(),
    userLng: z.coerce.number('Please provide valid longitude')
        .min(-180, 'Please provide a valid userLong (min -180)')
        .max(180, 'Please provide a valid userLong (max 180)')
        .nullable(),
    userName: z.string('Please provide valid name')
        .min(1, 'Please provide a valid userName (min 1 characters)')
        .max(100, 'Please provide a valid userName (max 100 characters)')
        .trim(),
    userState: z.string('Please provide valid state')
        .length(2, 'Please provide a valid userState (max 2 characters)')
        .trim()
        .nullable(),
})

export const PublicUserSchema = PrivateUserSchema.omit({userActivationToken: true, userHash: true, userEmail: true})

export type PrivateUser = z.infer<typeof PrivateUserSchema>
export type PublicUser = z.infer<typeof PublicUserSchema>

export async function insertUser (user: PrivateUser): Promise<string> {
    PrivateUserSchema.parse(user)
    const { userId, userActivationToken, userAvailability, userBio, userCity, userCreated, userEmail, userHash, userImgUrl, userLat, userLng, userName, userState } = user
    await sql`INSERT INTO "user"(user_id, user_activation_token, user_availability, user_bio, user_city, user_created, user_email, user_hash, user_img_url, user_lat, user_lng, user_name, user_state) VALUES (${userId}, ${userActivationToken}, ${userAvailability}, ${userBio}, ${userCity}, now(), ${userEmail}, ${userHash}, ${userImgUrl}, ${userLat}, ${userLng}, ${userName}, ${userState})`
    return 'User created successfully'
}

export async function selectPrivateUserByUserActivationToken (userActivationToken: string | null): Promise<PrivateUser | null> {

    const rowList = await sql`SELECT user_id, user_bio, user_activation_token, user_email, user_hash, user_img_url, user_availability, user_name, user_lng, user_lat, user_state, user_city, user_created FROM "user" WHERE user_activation_token = ${userActivationToken}`
    const result = PrivateUserSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

export async function updateUser (user: PrivateUser): Promise<string> {
    const {userId, userBio, userActivationToken, userAvailability, userCity, userCreated, userEmail, userHash, userImgUrl, userLat, userLng, userName, userState} = user
    await sql`UPDATE "user" SET user_bio = ${userBio}, user_activation_token = ${userActivationToken}, user_availability =  ${userAvailability}, user_city = ${userCity}, user_created = ${userCreated}, user_email =  ${userEmail}, user_hash = ${userHash}, user_img_url =  ${userImgUrl}, user_lat = ${userLat}, user_lng = ${userLng}, user_name = ${userName}, user_state = ${userState} WHERE user_id = ${userId}`
    return 'User updated successfully'
}

export async function selectPrivateUserByUserEmail (userEmail: string): Promise<PrivateUser | null> {
    const rowList = await sql`SELECT user_id, user_bio, user_activation_token, user_email, user_hash, user_img_url, user_name, user_city, user_state, user_lng, user_lat, user_availability, user_created FROM "user" WHERE user_email = ${userEmail}`
    const result = PrivateUserSchema.array().max(1).parse(rowList)
    return result[0] ?? null
}

export async function selectPublicUserByUserId (userId: string): Promise<PublicUser | null> {
    const rowList = await sql`SELECT user_id, user_availability, user_bio, user_city, user_created, user_img_url, user_name, user_state, user_lat, user_lng FROM "user" WHERE user_id = ${userId}`
    const result = PublicUserSchema.array().max(1).parse(rowList)
    return result[0] ?? null

}
export async function updatePublicUser (user: PublicUser): Promise<string> {
    const {userId, userBio, userAvailability, userCity, userCreated, userImgUrl, userName, userState, userLat, userLng} = user
    await sql`UPDATE "user"
              SET user_bio          = ${userBio},
                  user_availability = ${userAvailability},
                  user_city         = ${userCity},
                  user_created      = ${userCreated},
                  user_img_url      = ${userImgUrl},
                  user_name         = ${userName},
                  user_state        = ${userState},
                  user_lat          = ${userLat},
                  user_lng          = ${userLng}
              WHERE user_id = ${userId}`
    return 'User updated successfully'
}

// export async function selectPublicUserByInterestId (userInterestInterestId: string): Promise<PublicUser[]> {
//     const rowList = await sql`SELECT user_id, user_availability, user_bio, user_city, user_created, user_img_url, user_name, user_state, user_lat, user_lng FROM "user" JOIN user_interest ON user_id = user_interest.user_interest_user_id WHERE user_interest.user_interest_interest_id = ${userInterestInterestId}`
//     return PublicUserSchema.array().parse(rowList)
// }

export async function selectPublicUserByInterestId(
    interestId: string,
    currentUserId: string,
    currentUserLat: number,
    currentUserLng: number,
    radiusMiles: number = 40
): Promise<PublicUser[]> {
    const rowList = await sql`
    SELECT
      u.user_id,
      u.user_availability,
      u.user_bio,
      u.user_city,
      u.user_created,
      u.user_img_url,
      u.user_name,
      u.user_state,
      u.user_lat,
      u.user_lng,
      haversine(${currentUserLng}, ${currentUserLat}, u.user_lng, u.user_lat) AS distance
    FROM "user" u
    JOIN user_interest ui ON u.user_id = ui.user_interest_user_id
    WHERE ui.user_interest_interest_id = ${interestId}
      AND u.user_id != ${currentUserId}
      AND u.user_lat IS NOT NULL
      AND u.user_lng IS NOT NULL
      AND haversine(${currentUserLng}, ${currentUserLat}, u.user_lng, u.user_lat) <= ${radiusMiles}
      AND (
        NOT EXISTS (
          SELECT 1 FROM match m
          WHERE
            (m.match_maker_id = ${currentUserId} AND m.match_receiver_id = u.user_id)
            OR
            (m.match_maker_id = u.user_id AND m.match_receiver_id = ${currentUserId})
        )
        OR EXISTS (
          SELECT 1 FROM match m
          WHERE
            m.match_maker_id = u.user_id
            AND m.match_receiver_id = ${currentUserId}
            AND m.match_accepted IS NULL
        )
      )
    ORDER BY distance ASC;
  `;
    return PublicUserSchema.array().parse(rowList);
}
//
// users by interest ID. users

// export async function updateUser (user: PrivateUser): Promise<string> {
//     PrivateUserSchema.parse(user)
//     const { userId, userAvailability, userBio, userCity, userCreated, userEmail, userHash, userImgUrl, userLat, userLng, userName, userState } = user
//     await sql`UPDATE "user" SET user_availability = ${userAvailability}, user_bio = ${userBio}, user_city = ${userCity}, user_created = ${userCreated}, user_email = ${userEmail}, user_hash = ${userHash}, user_img_url = ${userImgUrl}, user_lat = ${userLat}, user_lng = ${userLng}, user_name = ${userName}, user_state = ${userState} WHERE user_id = ${userId}`
//     return 'User updated successfully'
// }