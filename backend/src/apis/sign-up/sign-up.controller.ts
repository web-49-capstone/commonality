/**
 * Controller for handling user sign-up requests.
 * Validates input, creates user, sends activation email, and handles errors.
 */
import {SignUpUserSchema} from "./sign-up.schema.ts";
import {zodErrorResponse} from "../../utils/response.utils.ts";
import {setActivationToken, setHash} from "../../utils/auth.utils.ts";
import type { Request, Response } from 'express'
import Mailgun from "mailgun.js";
import formData from 'form-data'
import type {PrivateUser} from "../users/user.model.ts";
import {v7 as uuidv7} from "uuid"
import {insertUser} from "../users/user.model.ts";
import type {Status} from "../../utils/interfaces/Status.ts";

/**
 * POST /apis/sign-up
 * Registers a new user and sends activation email.
 * Validates request body using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function signupUserController( request: Request, response: Response) {
    try {
        // Validate request body
        const validationResult = SignUpUserSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { userEmail, userPassword, userName} = validationResult.data
        // Hash password and generate activation token
        const userHash = await setHash(userPassword)
        const userActivationToken = setActivationToken()
        // Default profile image
        const userImgUrl = 'https://res.cloudinary.com/dkwrrd3nn/image/upload/v1754511439/commonality-avatars/bub8zuxzclduu5ywfczw.png'
        // Activation link
        const basePath: string = `${request.protocol}://commonality.dev/activate/${userActivationToken}`
        const message = `<h2>Welcome to Commonality!</h2><p>Please click the link below to activate your account.</p><a href="${basePath}">${basePath}</a>`
        // Setup Mailgun client
        const mailgun: Mailgun = new Mailgun(formData)
        const mailgunClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string})
        const mailgunMessage = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN as string}>`,
            to: userEmail,
            subject: 'Commonality Account Activation',
            html: message
        }
        // Create user object
        const user: PrivateUser = {
            userId: uuidv7(),
            userAvailability: null,
            userActivationToken: userActivationToken,
            userBio: null,
            userCity: null,
            userCreated: null,
            userEmail,
            userHash,
            userImgUrl,
            userLat: null,
            userLng: null,
            userName,
            userState:null,
        }
        // Insert user and send activation email
        await insertUser(user)
        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN as string, mailgunMessage)
        const status: Status = {
            status: 200,
            message: 'User created successfully, please check your email for activation link',
            data: null
        }
        response.status(200).json(status)
    } catch (error: any) {
        // Handle duplicate email and other errors
        if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
            const status: Status = {
                status: 409,
                message: "An account with this email already exists.",
                data: null
            }
            return response.status(409).json(status)
        }
        console.error(error)
        const status:Status = {
            status: 500,
            message: error.message,
            data: null
        }
        response.status(200).json(status)
    }

}