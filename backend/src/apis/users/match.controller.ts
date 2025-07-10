import { Request, Response } from 'express'
import { swipeMatch, acceptMatchIfMutual, getMutualMatches, getPendingMatches } from './match.model.ts'
import { serverErrorResponse } from '../../utils/response.utils.ts'

export async function swipeMatchController(req: Request, res: Response) {
  try {
    const { makerId, receiverId } = req.body
    if (!makerId || !receiverId) return res.status(400).json({ status: 400, message: 'Missing user IDs' })
    await swipeMatch(makerId, receiverId)
    const isMutual = await acceptMatchIfMutual(makerId, receiverId)
    res.json({ status: 200, mutual: isMutual })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function getMutualMatchesController(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const matches = await getMutualMatches(userId)
    res.json({ status: 200, data: matches })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function getPendingMatchesController(req: Request, res: Response) {
  try {
    const { userId } = req.params
    const matches = await getPendingMatches(userId)
    res.json({ status: 200, data: matches })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

