import {
    MatchSchema,
    type Match,
    selectMatchByMatchMakerId,
    selectMatchByMatchReceiverId,
    insertMatch, selectAllMatches
} from "./matching.model.ts"
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Request, Response} from "express"
import type {Status as HttpStatus} from "../../utils/interfaces/Status.ts"

export async function getMatchesByMatchMakerIdController (request: Request, response: Response): Promise<void> {
    try {
        const data = await selectAllMatches()
        const httpStatus = {status: 200, message: null, data}
        response.json (httpStatus)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, [])
    }
}

export async function getMatchesByMatchReceiverId (request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MatchSchema
            .pick({matchId: true})
            .safeParse(request.params)
    }
    if (!validationResult.success) {
        zodErrorResponse(response, validationResult.error)
        return
    }

    const matchData = validationResult.data
    const result = await insertMatch(matchData)

    const httpStatus: HttpStatus = {status: 200, message: result, data: null}
    response.json(httpStatus)
} catch (error) {
    console.error(error)
    serverErrorResponse(resonse, null)
  }

  export async function getMatchesByMatchMakerId (request: Request, response: Response): Promise<void> {
    try
  }


