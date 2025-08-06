import { GroupMatchSchema } from './group-matching.model.ts'
import {
  insertGroupMatch,
  updateGroupMatch,
  selectPendingGroupMatchesByGroupId,
  selectPendingGroupMatchesByUserId,
  selectAcceptedGroupMatchesByGroupId,
  selectAcceptedGroupMatchesByUserId,
  findMatchingGroupsByUserId,
  checkIfGroupMatchExists
} from './group-matching.model.ts'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils.ts'
import type { Request, Response } from 'express'
import type { Status } from '../../utils/interfaces/Status.ts'
import { z } from 'zod/v4'
import { v7 as uuidv7 } from 'uuid'

export async function postGroupMatchController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = GroupMatchSchema
      .omit({ groupMatchCreated: true })
      .safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupMatchGroupId, groupMatchAccepted } = validationResult.data
    const user = request.session?.user
    const groupMatchUserId = user?.userId

    if (!groupMatchUserId) {
      response.json({ status: 400, message: 'you are not allowed to perform this task', data: null })
      return
    }

    // Check if match already exists
    const exists = await checkIfGroupMatchExists(groupMatchUserId, groupMatchGroupId)
    if (exists) {
      response.json({ status: 400, message: 'group match already exists', data: null })
      return
    }

    const groupMatch = {
      groupMatchUserId,
      groupMatchGroupId,
      groupMatchAccepted,
      groupMatchCreated: new Date()
    }

    const result = await insertGroupMatch(groupMatch)
    const status: Status = { status: 200, message: result, data: null }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

export async function getPendingGroupMatchesByGroupIdController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({ groupId: z.string().uuid() }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupId } = validationResult.data
    const user = request.session?.user
    const userId = user?.userId

    if (!userId) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    // Verify user is admin of the group
    const groupResult = await sql`
      SELECT group_admin_user_id FROM "group" WHERE group_id = ${groupId}
    `
    
    if (groupResult.length === 0 || groupResult[0].group_admin_user_id !== userId) {
      response.json({ status: 403, message: 'Only group admin can view pending matches', data: null })
      return
    }

    const data = await selectPendingGroupMatchesByGroupId(groupId)
    const status: Status = { status: 200, message: null, data }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, [])
  }
}

export async function getPendingGroupMatchesByUserIdController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({ userId: z.string().uuid() }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { userId } = validationResult.data
    const user = request.session?.user
    const userIdFromSession = user?.userId

    if (!userIdFromSession || userId !== userIdFromSession) {
      response.json({ status: 400, message: 'you are not allowed to perform this task', data: null })
      return
    }

    const data = await selectPendingGroupMatchesByUserId(userId)
    const status: Status = { status: 200, message: null, data }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, [])
  }
}

export async function getMatchingGroupsController(request: Request, response: Response): Promise<void> {
  try {
    const user = request.session?.user
    const userId = user?.userId

    if (!userId) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    const data = await findMatchingGroupsByUserId(userId)
    const status: Status = { status: 200, message: null, data }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, [])
  }
}

export async function getAcceptedGroupMatchesByUserIdController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({ userId: z.string().uuid() }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { userId } = validationResult.data
    const user = request.session?.user
    const userIdFromSession = user?.userId

    if (!userIdFromSession || userId !== userIdFromSession) {
      response.json({ status: 400, message: 'you are not allowed to perform this task', data: null })
      return
    }

    const data = await selectAcceptedGroupMatchesByUserId(userId)
    const status: Status = { status: 200, message: null, data }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, [])
  }
}

export async function putGroupMatchController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({
      userId: z.string().uuid(),
      groupId: z.string().uuid()
    }).safeParse(request.params)

    const bodyValidationResult = GroupMatchSchema.pick({ groupMatchAccepted: true }).safeParse(request.body)

    if (!validationResult.success || !bodyValidationResult.success) {
      zodErrorResponse(response, validationResult.success ? bodyValidationResult.error : validationResult.error)
      return
    }

    const { userId, groupId } = validationResult.data
    const { groupMatchAccepted } = bodyValidationResult.data
    const user = request.session?.user
    const userIdFromSession = user?.userId

    if (!userIdFromSession) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    // Verify user is admin of the group
    const groupResult = await sql`
      SELECT group_admin_user_id FROM "group" WHERE group_id = ${groupId}
    `
    
    if (groupResult.length === 0 || groupResult[0].group_admin_user_id !== userIdFromSession) {
      response.json({ status: 403, message: 'Only group admin can accept/reject matches', data: null })
      return
    }

    const result = await updateGroupMatch(userId, groupId, groupMatchAccepted)
    const status: Status = { status: 200, message: result, data: null }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

export async function getGroupMatchStatusController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({
      userId: z.string().uuid(),
      groupId: z.string().uuid()
    }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { userId, groupId } = validationResult.data
    const user = request.session?.user
    const userIdFromSession = user?.userId

    if (!userIdFromSession || userId !== userIdFromSession) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    const rowList = await sql`
      SELECT 
        group_match_accepted as "status",
        group_match_created as "createdAt"
      FROM group_match 
      WHERE group_match_user_id = ${userId} AND group_match_group_id = ${groupId}
    `

    if (rowList.length === 0) {
      response.json({ status: 200, message: null, data: null })
      return
    }

    const match = rowList[0]
    let status: 'pending' | 'accepted' | 'rejected'
    
    if (match.status === null) {
      status = 'pending'
    } else if (match.status === true) {
      status = 'accepted'
    } else {
      status = 'rejected'
    }

    response.json({ status: 200, message: null, data: { status, createdAt: match.createdAt } })
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

export async function getPendingGroupMatchesCountController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({
      groupId: z.string().uuid()
    }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupId } = validationResult.data
    const user = request.session?.user
    const userId = user?.userId

    if (!userId) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    // Verify user is admin of the group
    const groupResult = await sql`
      SELECT group_admin_user_id FROM "group" WHERE group_id = ${groupId}
    `
    
    if (groupResult.length === 0 || groupResult[0].group_admin_user_id !== userId) {
      response.json({ status: 403, message: 'Only group admin can view pending matches count', data: null })
      return
    }

    const rowList = await sql`
      SELECT COUNT(*) as count
      FROM group_match 
      WHERE group_match_group_id = ${groupId} 
        AND group_match_accepted IS NULL
    `

    response.json({ status: 200, message: null, data: rowList[0]?.count || 0 })
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

// Import sql at the top
import { sql } from '../../utils/database.utils.ts'