import {
    deleteUserInterest,
    insertInterest,
    insertUserInterestInterestId,
    type Interest,
    InterestSchema,
    selectAllInterests,
    selectInterestByInterestId,
    selectInterestsByInterestName,
    selectInterestsByUserId, selectUserInterestByUserInterest,
    type UserInterest,
    UserInterestSchema
} from "./interest.model.ts";
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request, Response} from "express";
import type {Status, Status as HttpStatus} from "../../utils/interfaces/Status.ts"
import {sql} from "../../utils/database.utils.ts";

/**
 * GET /interests
 * Retrieves all interests from the database.
 * @param request Express request object
 * @param response Express response object
 */
export async function getAllInterestsController (request: Request, response: Response): Promise<void> {
    try {
        // Fetch all interests
        const data = await selectAllInterests()
        const httpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, [])
    }
}

/**
 * GET /interests/:interestName
 * Retrieves interests by their name.
 * Validates params using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function getInterestsByInterestNameController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = InterestSchema.pick({interestName: true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { interestName } = validationResult.data
        // Fetch interests by name
        const data = await selectInterestsByInterestName(interestName)
        const httpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, [])
    }
}

/**
 * GET /interests/:interestId
 * Retrieves a single interest by its ID.
 * Validates params using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function getInterestByInterestIdController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = InterestSchema
            .pick({interestId: true})
            .safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { interestId } = validationResult.data
        // Fetch interest by ID
        const data = await selectInterestByInterestId(interestId)
        const httpStatus: HttpStatus = { status: 200, message: null, data }
        response.json(httpStatus)

    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * POST /interests
 * Creates a new interest.
 * Validates body using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function postInterestController(request: Request, response: Response): Promise<void> {
    try {
        // Validate request body
        const validationResult = InterestSchema.safeParse(request.body)
        if (!validationResult.success) {
            return zodErrorResponse (response, validationResult.error)
        }
        const {interestId, interestName} = validationResult.data
        // Create interest object
        const interest: Interest = { interestId, interestName }
        // Insert interest into database
        const result = await insertInterest(interest)
        const httpStatus: HttpStatus = {status: 200, message: result, data:null}
        response.json(httpStatus)
    } catch (error) {
        // Log and handle error
        console.error(error)
        response.json ({ status: 500, message: 'error adding an interest, try again', data: null})
    }
}

/**
 * GET /user-interests/:userId
 * Retrieves interests for a specific user.
 * Validates params using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function getInterestByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = UserInterestSchema
            .pick({userInterestUserId: true})
            .safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { userInterestUserId } = validationResult.data
        // Fetch interests by user ID
        const data = await selectInterestsByUserId(userInterestUserId)
        const httpStatus: HttpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * POST /user-interests
 * Adds an interest to a user.
 * Validates body using Zod schema.
 * Checks for duplicates before insertion.
 * @param request Express request object
 * @param response Express response object
 */
export async function postUserInterestController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request body
        const validationResult = UserInterestSchema.safeParse(request.body)
        if (!validationResult.success) {
             zodErrorResponse (response, validationResult.error)
            return
        }
        const {userInterestInterestId} = validationResult.data
        // Get user from session
        const user = request.session?.user
        const userInterestUserId = user?.userId
        if(!userInterestUserId) {
            response.json({ status: 401, message: 'Unauthorized', data: null })
            return
        }
        // Create user interest object
        const userInterest: UserInterest = {
            userInterestInterestId,
            userInterestUserId
        }
        // Check for duplicate user interest
        const userInterestFromDatabase = await selectUserInterestByUserInterest(userInterest)
        if (userInterestFromDatabase) {
            response.json({ status: 400, message: 'You already have this interest.', data: null })
            return
        }
        // Insert user interest
        const result = await insertUserInterestInterestId(userInterest)
        const status: Status = { status: 200, message: result, data: null }
        response.json(status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * DELETE /user-interests/:interestId
 * Removes an interest from a user.
 * Validates params using Zod schema.
 * @param request Express request object
 * @param response Express response object
 */
export async function deleteUserInterestController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = UserInterestSchema.pick({userInterestInterestId: true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        // Get user from session
        const user = request.session?.user
        const userInterestUserId = user?.userId
        if(!userInterestUserId) {
            response.json({ status: 401, message: 'Unauthorized', data: null })
            return
        }
        const { userInterestInterestId } = validationResult.data
        // Create user interest object for deletion
        const userInterest: UserInterest = { userInterestInterestId, userInterestUserId }
        // Delete user interest
        const result = await deleteUserInterest(userInterest)
        const status: Status = { status: 200, message: result, data: null }
        response.json(status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}