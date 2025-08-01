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
  selectGroupById, type Group, selectGroupsByUserId,
} from './group.model.ts'
import {PublicUserSchema} from "../users/user.model.ts";
import {UserInterestSchema} from "../interests/interest.model.ts";
import {updateMessageWhenOpened} from "../message/message.model.ts";

export async function postGroupController (request: Request, response: Response): Promise<void> {
  try {
    console.log("➡️ Received request to create group:", request.body)

    const validationResult = GroupCreationSchema.safeParse(request.body)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }
    const group = {
      groupId: uuidv7(),
      groupName: validationResult.data.groupName,
      groupAdminUserId: validationResult.data.groupAdminUserId,
      groupDescription: validationResult.data.groupDescription,
      groupSize: validationResult.data.groupSize
    }
    const newGroup = await createGroup(group)
    // console.log('DEBUG: groupId returned from createGroup:', groupId)
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

export async function getGroupsByInterestController (request: Request, response: Response): Promise<void> {
  try {
    const validationResult = z.object({ interestId: z.string().uuid() }).safeParse(request.params)

    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { interestId } = validationResult.data
    const data = await findGroupsByInterest(interestId)
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
    console.log("fasfsa",userId)


    const data = await selectGroupsByUserId(userId);
    const status: Status = { status: 200, data, message: null };
    response.json(status);
  } catch (error: any) {
    serverErrorResponse(response, error);
  }
}

