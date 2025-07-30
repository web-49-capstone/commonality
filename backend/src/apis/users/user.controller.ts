import {
    type PublicUser,
    PublicUserSchema, selectPublicUserByInterestId,
    selectPublicUserByUserId,
    updatePublicUser,
    updateUser
} from "./user.model.ts";
import {type Request, type Response} from 'express'
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Status} from "../../utils/interfaces/Status.ts";
import {UserInterestSchema} from "../interests/interest.model.ts";
import {generateJwt} from "../../utils/auth.utils.ts";
import pkg from "jsonwebtoken";
const {verify} = pkg


export async function putUserController (request: Request, response: Response): Promise<void> {
    try {
        const paramsValidationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)
        const bodyValidationResult = PublicUserSchema.safeParse(request.body)

        if (!paramsValidationResult.success) {
            zodErrorResponse(response, paramsValidationResult.error)
            return
        }
        if (!bodyValidationResult.success) {
            zodErrorResponse(response, bodyValidationResult.error)
            return
        }
        const {userId} = paramsValidationResult.data
        const {userName, userBio, userAvailability, userCity, userState, userImgUrl, userLat, userLng} = bodyValidationResult.data
        console.log("bodyvalidationresult data = ", bodyValidationResult.data)
        const userFromSession = request.session.user
        const userIdFromSession = userFromSession?.userId
        if (userId !== userIdFromSession) {
            response.json({status: 400, data: null,message: "You are not allowed to preform this task" })
        }
        const user: PublicUser | null = await selectPublicUserByUserId(userId)

        if(user === null) {
            response.json({status: 400, data: null,message:"User does not exist" })
            return
        }
        user.userBio = userBio
        user.userName = userName
        user.userAvailability = userAvailability
        user.userCity = userCity
        user.userState = userState
        user.userImgUrl = userImgUrl
        user.userLat = userLat
        user.userLng = userLng

        await updatePublicUser(user)

        const jwt = request.session.jwt ?? ''
        const signature = request.session.signature ?? ''
        const parsedJwt = verify(jwt, signature);
        if (typeof parsedJwt === "string") {
            response.json({status: 400, data: null,message:"Invalid JWT Token" })
        }
        parsedJwt.auth = {
            userId: user.userId,
            userBio: user.userBio,
            userName: user.userName,
            userAvailability: user.userAvailability,
            userCity: user.userCity,
            userCreated: user.userCreated,
            userState: user.userState,
            userImgUrl: user.userImgUrl,
            userLat: user.userLat,
            userLng: user.userLng
        }

        const newJwt = generateJwt(parsedJwt.auth, signature)
        request.session.user = {
            userId: user.userId,
            userBio: user.userBio,
            userName: user.userName,
            userAvailability: user.userAvailability,
            userCity: user.userCity,
            userCreated: user.userCreated,
            userState: user.userState,
            userImgUrl: user.userImgUrl,
            userLat: user.userLat,
            userLng: user.userLng
        }

        request.session.jwt = newJwt
        response.header({
            authorization: newJwt
        })
        response.json({status: 200, data: null,message:"User updated" })

    } catch (error: any) {
        serverErrorResponse(response, null)
    }
}
export async function getUserByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const {userId} = validationResult.data
        const data = await selectPublicUserByUserId(userId)
        const status: Status = {status: 200, data, message: null}
        response.json(status)
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

export async function getPublicUserByInterestIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = UserInterestSchema.pick({userInterestInterestId: true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const userFromSession = request.session.user
        const userIdFromSession = userFromSession?.userId ?? ''

        const {userInterestInterestId} = validationResult.data
        const userLat = userFromSession?.userLat ?? 0
        const userLng = userFromSession?.userLng ?? 0
        const radius = 40
        const data = await selectPublicUserByInterestId(userInterestInterestId, userIdFromSession, userLat, userLng, radius)
        const staus: Status = {status: 200, data, message: null}
        response.json(staus)
    } catch (error: any) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}