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

// export async function putMessageWhenOpenedController(request: Request, response: Response): Promise<void> {
//     try {
//         const paramsValidationResult = MessageSchema.pick({messageId: true}).safeParse(request.params)
//         const bodyValidationResult = MessageSchema.safeParse(request.body)
//         if(!paramsValidationResult.success) {
//             zodErrorResponse(response, paramsValidationResult.error)
//             return
//         }
//         if(!bodyValidationResult.success) {
//             zodErrorResponse(response, bodyValidationResult.error)
//             return
//         }
//         const {messageId} = paramsValidationResult.data
//         const {messageReceiverId, messageSenderId, messageBody, messageOpened, messageSentAt} = bodyValidationResult.data
//         const userFromSession = request.session?.user
//         const userIdFromSession = userFromSession?.userId
//         if (!userIdFromSession || userIdFromSession !== messageReceiverId) {
//             response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
//             return
//             }
//         const result = await updateMessageWhenOpened(messageId)
//         const status: Status = {status: 200, message: result, data: null}
//         response.json(status)
//     } catch (error) {
//         console.error(error)
//         serverErrorResponse(response, null)
//     }
// }

export async function deleteMessageController(request: Request, response: Response): Promise<void> {
    try {
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
        const result = await deleteMessage(messageId)
        const status: Status = {status: 200, message: result, data: null}
        response.json(status)
    } catch (error) {
        console.error(error)
        serverErrorResponse(response, null)
    }
}

// export async function getMessageByUserIdController(request: Request, response: Response): Promise<void> {
//     try {
//         const validationResult = MessageUserIdSchema.safeParse(request.params)
//         if(!validationResult.success) {
//             zodErrorResponse(response, validationResult.error)
//             return
//         }
//         const { userId } = validationResult.data
//         const data = await selectMessagesByUserId(userId)
//         const status: Status = { status: 200, message: null, data }
//         response.json(status)
//
//         const paramsValidationResult = MessageSchema.pick({messageId: true}).safeParse(request.params)
//         const bodyValidationResult = MessageSchema.safeParse(request.body)
//         if(!paramsValidationResult.success) {
//             zodErrorResponse(response, paramsValidationResult.error)
//             return
//         }
//         if(!bodyValidationResult.success) {
//             zodErrorResponse(response, bodyValidationResult.error)
//             return
//         }
//         const {messageId} = paramsValidationResult.data
//         const {messageReceiverId, messageSenderId, messageBody, messageOpened, messageSentAt} = bodyValidationResult.data
//         const userFromSession = request.session?.user
//         const userIdFromSession = userFromSession?.userId
//         if (!userIdFromSession || userIdFromSession !== messageReceiverId) {
//             response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
//             return
//             }
//         const result = await updateMessageWhenOpened(messageId)
//         response.json(status)
//
//     } catch (error) {
//         serverErrorResponse(response, null)
//     }
// }

export async function getMessageBySenderAndReceiverController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = PublicUserSchema.pick({userId: true}).safeParse(request.params)

        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }

        const userFromSession = request.session?.user
        const userIdFromSession =  userFromSession?.userId ?? ""

        await updateMessageWhenOpened(userIdFromSession, validationResult.data.userId)

        const messages = await selectMessagesBySenderAndReceiver(userIdFromSession, validationResult.data.userId)

        response.json({status: 200, message: null, messages })

    } catch (error) {
        serverErrorResponse(response, null)
    }
}


export async function getUnreadMessagesByUserIdController (request: Request, response: Response): Promise<void> {
    try {
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

        const data = await selectUnreadMessagesByUserId(messageReceiverId)
        const status: Status = { status: 200, message: null, data }
        response.json(status)
    } catch (error) {
        serverErrorResponse(response, null)
    }
}

export async function getLastMessagesWithPartnerInfoController(request: Request, response: Response): Promise<void> {
    try {
        const validationResult = MessageUserIdSchema.safeParse(request.params)
        if(!validationResult.success) {
            zodErrorResponse(response, validationResult.error)
            return
        }
        const { userId } = validationResult.data
        const user = request.session?.user
        const userIdFromSession = user?.userId
        console.log("Fetching last messages for userId:", userId)
        if (!userIdFromSession || userIdFromSession !== userId) {
            response.json({status: 400, data: null, message: "You are not allowed to perform this task" })
            return
        }
        const data = await selectLastMessagesWithPartnerInfo(userId)
        const status: Status = { status: 200, message: null, data }
        response.json(status)
    } catch (error) {
    console.error(error)
        serverErrorResponse(response, [])
    }
}