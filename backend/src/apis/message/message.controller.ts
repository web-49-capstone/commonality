import {insertMessage, type Message, MessageSchema} from "./message.model.ts";
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
        if(!messageSenderId === undefined || messageSenderId === null) {
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
        const validationResult = MessageSchema.pick({messageReceiverId: true || messageSenderId: true}).safeParse(request.params)
    }
}