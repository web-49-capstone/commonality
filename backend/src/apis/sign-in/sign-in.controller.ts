/**
 * Controller for handling user sign-in requests.
 * Validates credentials, checks user existence, verifies password, and issues JWT.
 * Sets session data for authenticated users.
 */
import type {Request, Response} from 'express';
import {type PrivateUser, PrivateUserSchema, selectPrivateUserByUserEmail} from "../users/user.model.ts";
import {z} from "zod/v4";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {generateJwt, validatePassword} from "../../utils/auth.utils.ts";
import {v7 as uuidv7} from "uuid"
import "../../index.ts";

/**
 * POST /apis/sign-in
 * Authenticates a user and starts a session.
 * Validates request body using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function signInController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request body for email and password
        const validationResult = PrivateUserSchema
            .pick({userEmail: true})
            .extend({
                userPassword: z.string('password is required')
                    .min(8, 'profile password must be over 8 characters')
                    .max(32, 'password must be 32 characters or less')
            }).safeParse(request.body)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {userEmail, userPassword} = validationResult.data
        // Look up user by email
        const user: PrivateUser | null = await selectPrivateUserByUserEmail(userEmail)
        const signInFailedStatus: Status = {status: 400, message: 'email or password is incorrect, please try again.', data: null}
        if (user === null) {
            response.json(signInFailedStatus)
            return
        }

        // Validate password
        const isPasswordValid = await validatePassword(user.userHash, userPassword)
        if (!isPasswordValid) {
            response.json(signInFailedStatus)
            return
        }
        if (user.userActivationToken !== null) {
            response.json({status: 400, message: 'Please activate your account before signing in', data: null})
            return
        }

        // Prepare JWT payload and session
        const { userId, userBio, userImgUrl, userName, userCity, userState, userLng, userLat, userAvailability, userCreated } = user
        const signature: string = uuidv7()
        const authorization: string = generateJwt({
            userId,
            userBio,
            userImgUrl,
            userCity,
            userState,
            userLng,
            userLat,
            userAvailability,
            userCreated,
            userName
        },signature)

        // Set session data
        request.session.user = user
        request.session.jwt = authorization
        request.session.signature = signature

        // Set authorization header
        response.header ({
            authorization
        })

        response.json({ status: 200, message: "sign in successful", data:null})
        return
    } catch (error:any) {
        // Handle unexpected errors
        response.json({ status: 500, data: null, message: error.message})
    }
}