/**
 * Controller functions for Matching-related API endpoints.
 * Handles match creation, retrieval, and validation for users.
 * Uses Zod schemas for validation and provides consistent error handling.
 */
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

/**
 * POST /matches
 * Creates a new match between two users.
 * Validates request body using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function postMatchController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request body
        const validationResult = MatchSchema
            .safeParse(request.body)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {matchReceiverId, matchAccepted, matchCreated} = validationResult.data
        // Get match maker ID from session
        const user = request.session?.user
        const matchMakerId = user?.userId
        if (!matchMakerId) {
            response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
            return
        }
        // Construct match object
        const match: Match = {matchMakerId, matchReceiverId, matchAccepted, matchCreated}
        // Insert match into database
        const result = await insertMatch(match)

        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * GET /matches/accepted/:userId
 * Retrieves all accepted matches for a user.
 * Validates params using Zod schema and checks session authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function getAcceptedMatchesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
          // Validate request params
          const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)
          if (!validationResult.success) {
              zodErrorResponse(response, validationResult.error)
              return
          }
          const {userId}= validationResult.data
          // Get user ID from session
          const user = request.session?.user
          const userIdFromSession = user?.userId
        if (userId !== userIdFromSession) {
        response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
        return
        }
          // Fetch accepted matches
          const data = await selectAcceptedMatchesByUserId(userIdFromSession, true)
          const status: Status = {status: 200, message: null, data}
          response.json (status)
      } catch (error) {
          // Log and handle server error
          console.error(error)
          serverErrorResponse(response, [])
      }
}

/**
 * GET /matches/declined/:userId
 * Retrieves all declined matches for a user.
 * Validates params using Zod schema and checks session authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function getDeclinedMatchesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
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

        // Fetch declined matches
        const data = await selectAcceptedMatchesByUserId(userId, false)
        const status: Status = {status: 200, message: null, data}
        response.json (status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, [])
    }
}

/**
 * GET /matches/check/:matchMakerId
 * Checks if a match exists between the authenticated user and another user.
 * Validates params using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function getCheckIfMatchExistsBetweenTwoUsers (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = MatchSchema.pick({matchMakerId:true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const {matchMakerId} = validationResult.data
        const userFromSession = request.session?.user
        const matchReceiverId = userFromSession?.userId ?? ''

        // Check if match exists
        const data = await checkIfMatchExistsBetweenTwoUsers(matchReceiverId, matchMakerId)
        const status: Status = {status: 200, message: null, data}
        response.json (status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, [])
    }
}

/**
 * PUT /matches/:matchMakerId/:matchReceiverId
 * Updates the status of an existing match between two users.
 * Validates params and request body using Zod schemas.
 * @param request Express request object
 * @param response Express response object
 */
export async function putMatchController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params and body
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

        // Check if user is authorized to update the match
        if (!user || userIdFromSession !== matchReceiverId) {
            response.json({status: 400, message: 'you are not allowed to preform this task', data: null})
            return
        }
        // Update match in database
        const result = await updateMatch(matchMakerId, matchReceiverId, matchAccepted)
        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}
