import {
    MatchSchema,
    type Match,
    selectAcceptedMatchesByUserId,
    insertMatch, updateMatch, selectPendingMatchesByUserId, checkIfMatchExistsBetweenTwoUsers,
} from "./matching.model.ts"
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request, Response} from "express"
import type {Status} from "../../utils/interfaces/Status.ts"
import {PublicUserSchema} from "../users/user.model.ts";

export async function postMatchController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MatchSchema
            .safeParse(request.body)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {matchReceiverId, matchAccepted, matchCreated} = validationResult.data
        const user = request.session?.user
        const matchMakerId = user?.userId
        if (!matchMakerId) {
            response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
            return
        }
        const match: Match = {matchMakerId, matchReceiverId, matchAccepted, matchCreated}
        const result = await insertMatch(match)

        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}
  export async function getAcceptedMatchesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
          const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)
          if (!validationResult.success) {
              zodErrorResponse(response, validationResult.error)
              return
          }
          const {userId}= validationResult.data
        // const {matchAccepted} = validationResult.data
          const user = request.session?.user
          const userIdFromSession = user?.userId
        if (userId !== userIdFromSession) {
        response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
        return
        }

          const data = await selectAcceptedMatchesByUserId(userIdFromSession, true)
          const status: Status = {status: 200, message: null, data}
          response.json (status)
      } catch (error) {
          console.error(error)
          serverErrorResponse(response, [])
      }
}
export async function getDeclinedMatchesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = PublicUserSchema.pick({userId:true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const {userId} = validationResult.data
        // const {matchAccepted} = validationResult.data
        const user = request.session?.user
        const userIdFromSession = user?.userId
        if (!userIdFromSession || userId !== userIdFromSession) {
            response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
            return
        }

        const data = await selectAcceptedMatchesByUserId(userId, false)
        const status: Status = {status: 200, message: null, data}
        response.json (status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, [])
    }
}
export async function getCheckIfMatchExistsBetweenTwoUsers (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MatchSchema.pick({matchMakerId:true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const {matchMakerId} = validationResult.data
        const userFromSession = request.session?.user
        const matchReceiverId = userFromSession?.userId ?? ''

        const data = await checkIfMatchExistsBetweenTwoUsers(matchReceiverId, matchMakerId)
        const status: Status = {status: 200, message: null, data}
        response.json (status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, [])
    }
}

export async function putMatchController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MatchSchema.pick({matchMakerId: true, matchReceiverId:true}).safeParse(request.params)
        const bodyValidationResult = MatchSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        if (!bodyValidationResult.success) {
            zodErrorResponse(response, bodyValidationResult.error)
            return
        }
        const {matchReceiverId, matchMakerId} = validationResult.data
        const {matchAccepted} = bodyValidationResult.data
        const user = request.session?.user
        const userIdFromSession = user?.userId

        if (!user || userIdFromSession !== matchReceiverId) {
            response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
            return
        }
        const result = await updateMatch(matchMakerId, matchReceiverId, matchAccepted)
        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

