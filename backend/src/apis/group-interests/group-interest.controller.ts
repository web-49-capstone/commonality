import {type Request, type Response} from "express";
import {zodErrorResponse, serverErrorResponse} from "../../utils/response.utils.ts";
import {
    GroupInterestSchema,
    insertGroupInterest,
    selectGroupInterestByGroupInterest,
    deleteGroupInterest,
    selectInterestsByGroupId
} from "./group-interest.model.ts";
import type {Status as HttpStatus, Status} from "../../utils/interfaces/Status.ts";
import {selectInterestsByUserId, UserInterestSchema} from "../interests/interest.model.ts";

export async function postGroupInterestController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = GroupInterestSchema.safeParse(request.body)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const {groupInterestGroupId, groupInterestInterestId} = validationResult.data

        const groupInterest = {
            groupInterestGroupId,
            groupInterestInterestId
        }

        const groupInterestFromDatabase = await selectGroupInterestByGroupInterest(groupInterest)

        if (groupInterestFromDatabase) {
            response.json({status: 400, message: 'Group already has this interest.', data: null})
            return
        }

        const result = await insertGroupInterest(groupInterest)
        const status: Status = { status: 200, message: result, data: null }
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

export async function deleteGroupInterestController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = GroupInterestSchema.safeParse(request.body)

        if (!validationResult.success) {
            return zodErrorResponse(response, validationResult.error)
        }

        const { groupInterestGroupId, groupInterestInterestId } = validationResult.data
        const groupInterest = { groupInterestGroupId, groupInterestInterestId }
        const result = await deleteGroupInterest(groupInterest)
        const status: Status = { status: 200, message: result, data: null }
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}
export async function getInterestByGroupIdController (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = GroupInterestSchema
            .pick({groupInterestGroupId: true})

            .safeParse(request.params)

        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const { groupInterestGroupId } = validationResult.data
        const data = await selectInterestsByGroupId(groupInterestGroupId)
        const httpStatus: HttpStatus = { status: 200, message: null, data }
        response.json(httpStatus)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}