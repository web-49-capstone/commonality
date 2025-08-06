import {v7 as uuidv7} from "uuid"

import { type Request, type Response } from 'express'
import { z } from 'zod/v4'
import { serverErrorResponse, zodErrorResponse } from '../../utils/response.utils.ts'
import { type Status } from '../../utils/interfaces/Status.ts'
import {
  createGroup,
  deleteGroup,
  findGroupsByInterest,
  findMatchingGroups,
  GroupCreationSchema,
  GroupSchema,
  searchGroups,
  updateGroup,
  selectGroupById, type Group, selectGroupsByUserId
} from './group.model.ts'
import {PublicUserSchema} from "../users/user.model.ts";

const InterestIdsSchema = z.array(z.string().uuid())

export async function postGroupController (request: Request, response: Response): Promise<void> {
  try {

    const validationResult = GroupCreationSchema.safeParse(request.body)

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error)
      console.error("Received body:", request.body)
      zodErrorResponse(response, validationResult.error)
      return
    }

    const groupData = validationResult.data
    const group = {
      groupId: uuidv7(),
      ...groupData
    }
    
    await createGroup(group)
    
    const status: Status = { status: 200, data: { group }, message: 'Group created successfully' }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function putGroupController (request: Request, response: Response): Promise<void> {
  try {
    const paramsValidationResult = GroupSchema.pick({ groupId: true }).safeParse(request.params)

    if (!paramsValidationResult.success) {
      zodErrorResponse(response, paramsValidationResult.error)
      return
    }

    const validationResult = GroupSchema.safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const data = await updateGroup(validationResult.data)
    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function deleteGroupController (request: Request, response: Response): Promise<void> {
  try {
    const validationResult = GroupSchema.pick({ groupId: true }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupId } = validationResult.data
    const data = await deleteGroup(groupId)
    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function getGroupsController (request: Request, response: Response): Promise<void> {
  try {
    const { q } = request.query

    if (q === undefined) {
      response.json({ status: 400, data: null, message: 'Query parameter is required' })
      return
    }

    const data = await searchGroups(q as string)
    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function getMatchingGroupsController (request: Request, response: Response): Promise<void> {
  try {
    // @ts-ignore
    const { userId } = request.session.user

    if (userId === undefined) {
      response.json({ status: 401, data: null, message: 'Unauthorized' })
      return
    }

    const data = await findMatchingGroups(userId)
    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function getGroupsByInterestController (request: Request, response: Response): Promise<void> {
  try {
    // @ts-ignore
    const { userId } = request.session.user
    const { interestId } = request.params

    if (userId === undefined) {
      response.json({ status: 401, data: null, message: 'Unauthorized' })
      return
    }

    const data = await findGroupsByInterest(interestId)
    
    // Filter out groups where user is admin or already member
    const filteredGroups = data.filter(group => 
      group.groupAdminUserId !== userId
    )
    
    const status: Status = { status: 200, data: filteredGroups, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function getGroupByIdController (request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({ groupId: z.string().uuid() }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { groupId } = validationResult.data
    const data = await selectGroupById(groupId)

    if (data === null) {
      response.json({ status: 404, data: null, message: 'Group not found' })
      return
    }

    const status: Status = { status: 200, data, message: null }
    response.json(status)
  } catch (error: any) {
    serverErrorResponse(response, error)
  }
}

export async function getGroupsByUserIdController(request: Request, response: Response): Promise<void> {
  try {

    const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)

    if(!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }
const { userId } = validationResult.data
    // const userFromSession = request.session?.user
    // const userId1 =  userFromSession?.userId ?? "
    // "


    const data = await selectGroupsByUserId(userId);
    const status: Status = { status: 200, data, message: null };
    response.json(status);
  } catch (error: any) {
    serverErrorResponse(response, error);
  }
}

