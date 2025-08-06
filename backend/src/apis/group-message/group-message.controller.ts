import { GroupMessageSchema } from './group-message.model.ts'
import {
  insertGroupMessage,
  selectGroupMessagesByGroupId,
  deleteGroupMessage,
  checkUserGroupMembership,
  checkUserGroupAdmin
} from './group-message.model.ts'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils.ts'
import type { Request, Response } from 'express'
import type { Status } from '../../utils/interfaces/Status.ts'
import { v7 as uuidv7 } from 'uuid'
import { z } from 'zod/v4'
import pkg from "jsonwebtoken";
const { decode: jwtDecode } = pkg

export async function postGroupMessageController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = GroupMessageSchema
      .omit({ groupMessageId: true, groupMessageSentAt: true })
      .safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupMessageGroupId, groupMessageUserId, groupMessageBody } = validationResult.data
    // Check both session and JWT token methods
    const authHeader = request.headers.authorization
    const user = request.session?.user
    const userIdFromSession = user?.userId

    console.log('DEBUG: Auth check -', {
      hasSession: !!request.session,
      hasUser: !!request.session?.user,
      sessionUserId: request.session?.user?.userId,
      authHeader: authHeader,
      sessionKeys: request.session ? Object.keys(request.session) : []
    })

    let userId = userIdFromSession
    
    // Fallback to JWT if available
    if (!userId && authHeader) {
      try {
        const decoded = jwtDecode(authHeader.replace('Bearer ', '')) as any
        userId = decoded.userId
        console.log('DEBUG: Using JWT auth', userId)
      } catch (e) {
        console.log('DEBUG: JWT decode failed', e)
      }
    }

    if (!userId) {
      console.log('DEBUG: No valid authentication found')
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    // Verify the user is sending the message themselves
    if (groupMessageUserId !== userId) {
      response.json({ status: 403, message: 'Cannot send message as another user', data: null })
      return
    }

    // Check if user is a member of the group
    const isMember = await checkUserGroupMembership(userId, groupMessageGroupId)
    if (!isMember) {
      response.json({ status: 403, message: 'User is not a member of this group', data: null })
      return
    }

    const groupMessage = {
      groupMessageId: uuidv7(),
      groupMessageGroupId,
      groupMessageUserId,
      groupMessageBody
    }

    await insertGroupMessage(groupMessage)
    console.log('DEBUG: Message inserted:', groupMessage)
    const status: Status = { status: 200, message: 'Group message sent successfully', data: null }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

export async function getGroupMessagesController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({
      groupId: z.string().uuid()
    }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupId } = validationResult.data
    const authHeader = request.headers.authorization
    const user = request.session?.user
    const userIdFromSession = user?.userId

    console.log('DEBUG: GET messages - Auth check -', {
      hasSession: !!request.session,
      hasUser: !!request.session?.user,
      sessionUserId: request.session?.user?.userId,
      authHeader: authHeader,
      sessionKeys: request.session ? Object.keys(request.session) : []
    })

    let userId = userIdFromSession
    
    // Fallback to JWT if available
    if (!userId && authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const decoded = jwtDecode(token) as any
        userId = decoded.userId
        console.log('DEBUG: GET messages - Using JWT auth', userId)
      } catch (e) {
        console.log('DEBUG: GET messages - JWT decode failed', e)
      }
    }

    if (!userId) {
      console.log('DEBUG: GET messages - No valid authentication found')
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    // Check if user is a member of the group
    const isMember = await checkUserGroupMembership(userId, groupId)
    console.log('DEBUG: Membership check for user', userId, 'in group', groupId, ':', isMember)
    if (!isMember) {
      response.json({ status: 403, message: 'User is not a member of this group', data: null })
      return
    }

    const data = await selectGroupMessagesByGroupId(groupId)
    console.log('DEBUG: Returning messages for group', groupId, ':', data.length, 'messages')
    const status: Status = { status: 200, message: null, data }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, [])
  }
}

export async function deleteGroupMessageController(request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({
      groupMessageId: z.string().uuid()
    }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupMessageId } = validationResult.data
    const user = request.session?.user
    const userIdFromSession = user?.userId

    if (!userIdFromSession) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    const result = await deleteGroupMessage(groupMessageId, userIdFromSession)
    const status: Status = { status: 200, message: result, data: null }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}

export async function checkGroupMembershipController(request: Request, response: Response): Promise<void> {
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
    const userIdFromSession = user?.userId

    if (!userIdFromSession) {
      response.json({ status: 401, message: 'Unauthorized', data: null })
      return
    }

    const isMember = await checkUserGroupMembership(userIdFromSession, groupId)
    const status: Status = { status: 200, message: null, data: { isMember } }
    response.json(status)
  } catch (error) {
    console.error(error)
    serverErrorResponse(response, null)
  }
}