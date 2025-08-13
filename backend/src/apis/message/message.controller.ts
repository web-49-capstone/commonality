/**
 * Controller functions for Message-related API endpoints.
 * Handles message creation, retrieval, deletion, and status updates.
 * Uses Zod schemas for validation and provides consistent error handling.
 */
import {
    deleteMessage,
    insertMessage,
    type Message,
    MessageSchema,
    MessageUserIdSchema, selectLastMessagesWithPartnerInfo, selectMessagesBySenderAndReceiver,
    selectUnreadMessagesByUserId, updateMessageWhenOpened
} from "./message.model.ts";
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Response, Request} from "express";
import type { Status } from '../../utils/interfaces/Status'
import {PublicUserSchema} from "../users/user.model.ts";

/**
 * POST /messages
 * Creates a new message.
 * Validates request body using Zod schema and checks sender authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function postMessageController(request: Request, response: Response): Promise<void> {
    try {
        // Validate request body
        const validationResult = MessageSchema.safeParse(request.body)
        if (!validationResult.success) {
             zodErrorResponse (response, validationResult.error)
                return
        }
        const { messageId, messageSenderId, messageReceiverId, messageBody, messageOpened, messageSentAt } = validationResult.data
        const user = request.session?.user
        const messageSenderIdFromSession = user?.userId
        if(messageSenderIdFromSession === undefined || messageSenderIdFromSession === null) {
            response.json({ status: 401, message: 'Unauthorized, please log in', data: null })
            return
        }
        // Construct message object
        const message: Message = { messageId, messageSenderId, messageReceiverId, messageBody, messageOpened, messageSentAt }
        // Insert message into database
        const result: string = await insertMessage(message)
        response.json({status: 200, data: null, message: result})
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * DELETE /messages/:messageId
 * Deletes a message.
 * Validates params and body using Zod schema and checks receiver authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function deleteMessageController(request: Request, response: Response): Promise<void> {
    try {
        // Validate request params and body
        const paramsValidationResult = MessageSchema.pick({messageId: true}).safeParse(request.params)
        const bodyValidationResult = MessageSchema.safeParse(request.body)
        if(!paramsValidationResult.success) {
            zodErrorResponse(response, paramsValidationResult.error)
            return
        }
        if(!bodyValidationResult.success) {
            zodErrorResponse(response, bodyValidationResult.error)
            return
        }
        const {messageId} = paramsValidationResult.data
        const {messageReceiverId, messageSenderId, messageBody, messageOpened, messageSentAt} = bodyValidationResult.data
        const userFromSession = request.session?.user
        const userIdFromSession = userFromSession?.userId
        if (!userIdFromSession || userIdFromSession !== messageReceiverId) {
            response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
            return
        }
        // Delete message from database
        const result = await deleteMessage(messageId)
        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        // Log and handle server error
        console.error(error)
        serverErrorResponse(response, null)
    }
}

/**
 * GET /messages/sender-receiver/:userId
 * Retrieves all messages exchanged between the authenticated user and another user.
 * Marks messages as opened for the receiver.
 * @param request Express request object
 * @param response Express response object
 */
export async function getMessageBySenderAndReceiverController(request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)
        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const userFromSession = request.session?.user
        const userIdFromSession =  userFromSession?.userId ?? ""
        // Mark messages as opened
        await updateMessageWhenOpened(userIdFromSession, validationResult.data.userId)
        // Fetch messages between sender and receiver
        const data = await selectMessagesBySenderAndReceiver(userIdFromSession, validationResult.data.userId)
        response.json({status: 200, message: null, data })
    } catch (error) {
        serverErrorResponse(response, null)
    }
}

/**
 * GET /messages/unread/:messageReceiverId
 * Retrieves all unread messages for the authenticated user.
 * Validates params and checks receiver authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function getUnreadMessagesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = MessageSchema.pick({messageReceiverId: true}).safeParse(request.params)
        if (!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { messageReceiverId } = validationResult.data
        const user = request.session?.user
        const userIdFromSession = user?.userId
        if (!userIdFromSession || userIdFromSession !== messageReceiverId) {
            response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
            return
        }
        // Fetch unread messages
        const data = await selectUnreadMessagesByUserId(messageReceiverId)
        const status: Status = { status: 200, message: null, data }
        response.json(status)
    } catch (error) {
        serverErrorResponse(response, null)
    }
}

/**
 * GET /messages/last-with-partner/:userId
 * Retrieves the last message with partner info for each partner of the authenticated user.
 * Validates params and checks user authorization.
 * @param request Express request object
 * @param response Express response object
 */
export async function getLastMessagesWithPartnerInfoController(request: Request, response: Response): Promise<void> {
    try {
        // Validate request params
        const validationResult = MessageUserIdSchema.safeParse(request.params)
        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { userId } = validationResult.data
        const user = request.session?.user
        const userIdFromSession = user?.userId
        if (!userIdFromSession || userIdFromSession !== userId) {
            response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
            return
        }
        // Fetch last messages with partner info
        const data = await selectLastMessagesWithPartnerInfo(userId)
        const status: Status = { status: 200, message: null, data }
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, [])
    }
}