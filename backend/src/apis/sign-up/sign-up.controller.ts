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


export async function signupUserController( request: Request, response: Response) {
    try {
        const validationResult = SignUpUserSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { userEmail, userPassword, userName} = validationResult.data

        const userHash = await setHash(userPassword)

        const userActivationToken = setActivationToken()

        const userImgUrl = 'https://res.cloudinary.com/dkwrrd3nn/image/upload/v1754511439/commonality-avatars/bub8zuxzclduu5ywfczw.png'

        const basePath: string = `${request.protocol}://commonality.ddfullstack.cloud/activate/${userActivationToken}`

        const message = `<h2>Welcome to Commonality!</h2><p>Please click the link below to activate your account.</p><a href="${basePath}">${basePath}</a>`

        const mailgun: Mailgun = new Mailgun(formData)
        const mailgunClient = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY as string})

        const mailgunMessage = {
            from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN as string}>`,
            to: userEmail,
            subject: 'Commonality Account Activation',
            html: message
        }
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

        await insertUser(user)

        await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN as string, mailgunMessage)

        const status: Status = {
            status: 200,
            message: 'User created successfully, please check your email for activation link',
            data: null
        }

        response.status(200).json(status)
    } catch (error: any) {
        console.error(error)
        const status:Status = {
            status: 500,
            message: error.message,
            data: null
        }

        response.status(200).json(status)
    }

}