import {
    insertInterest,
    type Interest,
    InterestSchema,
    selectAllInterests,
    selectInterestByInterestId, selectInterestsByUserId, UserInterestSchema
} from "./interest.model.ts";
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request, Response} from "express";
import type {Status as HttpStatus} from "../../utils/interfaces/Status.ts"
import {sql} from "../../utils/database.utils.ts";

export async function getAllInterestsController (request: Request, response: Response): Promise<void> {
    try {
        const data = await selectAllInterests()
        const httpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, [])
    }
}

export async function getInterestByInterestIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = InterestSchema
            .pick({interestId: true})
            .safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { interestId } = validationResult.data
        const data = await selectInterestByInterestId(interestId)
        const httpStatus: HttpStatus = { status: 200, message: null, data }
        response.json(httpStatus)

    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

export async function postInterestController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = InterestSchema.safeParse(request.body)
        if (!validationResult.success) {
            return zodErrorResponse (response, validationResult.error)
        }
        const {interestId, interestName} = validationResult.data
        const interest: Interest = { interestId, interestName }
        const result = await insertInterest(interest)

        const httpStatus: HttpStatus = {status: 200, message: result, data:null}
        response.json(httpStatus)
    } catch (error) {
        console.error(error)
        response.json ({ status: 500, message: 'error adding an interest, try again', data: null})
    }
}

export async function getInterestByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = UserInterestSchema
            .pick({userInterestUserId: true})
            .safeParse(request.params)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { userInterestUserId } = validationResult.data
        const data = await selectInterestsByUserId(userInterestUserId)
        const httpStatus: HttpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}