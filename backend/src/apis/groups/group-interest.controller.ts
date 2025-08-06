import { type Request, type Response } from 'express'
import { z } from 'zod/v4'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils.ts'
import { type Status } from '../../utils/interfaces/Status.ts'
import { addGroupInterest } from './group.model.ts'

const AddInterestSchema = z.object({
  interestId: z.string().uuid()
})

export async function postGroupInterestController (request: Request, response: Response): Promise<void> {
  try {

    const paramsValidation = z.object({
      groupId: z.string().uuid()
    }).safeParse(request.params)
    
    if (!paramsValidation.success) {
      zodErrorResponse(response, paramsValidation.error)
      return
    }

    const bodyValidation = AddInterestSchema.safeParse(request.body)
    if (!bodyValidation.success) {
      zodErrorResponse(response, bodyValidation.error)
      return
    }

    const { groupId } = paramsValidation.data
    const { interestId } = bodyValidation.data

    await addGroupInterest(groupId, interestId)
    
    const status: Status = { status: 200, data: { groupId, interestId }, message: 'Interest added to group successfully' }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}