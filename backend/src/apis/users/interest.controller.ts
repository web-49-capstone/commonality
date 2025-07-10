import { Request, Response } from 'express'
import { getAllInterests, getUserInterests, updateUserInterests } from './interest.model.ts'
import { zodErrorResponse, serverErrorResponse } from '../../utils/response.utils.ts'
import { z } from 'zod'

export async function getAllInterestsController(req: Request, res: Response) {
  try {
    const interests = await getAllInterests()
    res.json({ status: 200, data: interests })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function getUserInterestsController(req: Request, res: Response) {
  try {
    const userId = req.params.userId
    if (!userId) return res.status(400).json({ status: 400, message: 'Missing userId' })
    const interests = await getUserInterests(userId)
    res.json({ status: 200, data: interests })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

const UserInterestsSchema = z.object({
  interests: z.array(z.string().uuid())
})

export async function putUserInterestsController(req: Request, res: Response) {
  try {
    const userId = req.params.userId
    const parse = UserInterestsSchema.safeParse(req.body)
    if (!parse.success) return zodErrorResponse(res, parse.error)
    await updateUserInterests(userId, parse.data.interests)
    res.json({ status: 200, message: 'User interests updated' })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

