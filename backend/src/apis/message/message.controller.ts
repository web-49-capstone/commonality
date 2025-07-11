import {
    insertMessage,
    type Message,
    MessageSchema,
    MessageUserIdSchema,
    selectMessagesByUserId
} from "./message.model.ts";
import {serverErrorResponse, zodErrorResponse} from "../../utils/response.utils.ts";
import type {Response, Request} from "express";
import type { Status } from '../../utils/interfaces/Status'


export async function postMessageController(request: Request, response: Response): Promise<void> {
    try {
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
        const message: Message = { messageId, messageSenderId, messageReceiverId, messageBody, messageOpened, messageSentAt }
        const result: string = await insertMessage(message)

        response.json({status: 200, data: null, message: result})
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

export async function getMessageByUserIdController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MessageUserIdSchema.safeParse(request.params)
        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { userId } = validationResult.data
        const data = await selectMessagesByUserId(userId)
        const status: Status = { status: 200, message: null, data }
        response.json(status)
    } catch (error) {
        serverErrorResponse(response, null)
    }
}