import {
  type PublicUser,
  PublicUserSchema,
  selectPublicUserByUserId,
  updatePublicUser
} from './user.model.ts'
import { type Request, type Response } from 'express'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils.ts'
import type { Status } from '../../utils/interfaces/Status.ts'

export async function putUserController (request: Request, response: Response): Promise<void> {
  try {
    const paramsValidationResult = PublicUserSchema.pick({ userId: true }).safeParse(request.params)
    const bodyValidationResult = PublicUserSchema.safeParse(request.body)

    if (!paramsValidationResult.success) {
      zodErrorResponse(response, paramsValidationResult.error)
      return
    }
    if (!bodyValidationResult.success) {
      zodErrorResponse(response, bodyValidationResult.error)
      return
    }
    const { userId } = paramsValidationResult.data
    const { userName, userBio, userAvailability, userCity, userState, userImgUrl, userCreated } = bodyValidationResult.data

    const userFromSession = request.session.user
    const userIdFromSession = userFromSession?.userId
    if (userId !== userIdFromSession) {
      response.json({ status: 400, data: null, message: 'You are not allowed to preform this task' })
    }
    const user: PublicUser | null = await selectPublicUserByUserId(userId)

    if (user === null) {
      response.json({ status: 400, data: null, message: 'User does not exist' })
      return
    }
    user.userBio = userBio
    user.userName = userName
    user.userAvailability = userAvailability
    user.userCreated = userCreated
    user.userCity = userCity
    user.userState = userState
    user.userImgUrl = userImgUrl

    await updatePublicUser(user)
    response.json({ status: 200, data: null, message: 'User updated' })
  } catch (error: any) {
    serverErrorResponse(response, null)
  }
}
export async function getUserByUserIdController (request: Request, response: Response): Promise<void> {
  try {
    const validationResult = PublicUserSchema.pick({ userId: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }
    const { userId } = validationResult.data
    const data = await selectPublicUserByUserId(userId)
    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}
export async function getUserMatchesController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = PublicUserSchema.pick({ userId: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }
    const { userId } = validationResult.data
    const matches = await findMatchingUsersByInterests(userId)
    response.json({ status: 200, data: matches, message: null })
  } catch (error: any) {
    serverErrorResponse(response, null)
  }
}
