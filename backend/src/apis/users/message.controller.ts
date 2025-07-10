import { Request, Response } from 'express'
import { sendMessage, getConversation, markMessagesAsRead, getUserConversations } from './message.model.ts'
import { serverErrorResponse } from '../../utils/response.utils.ts'

export async function sendMessageController(req: Request, res: Response) {
  try {
    const { senderId, receiverId, body } = req.body
    if (!senderId || !receiverId || !body) return res.status(400).json({ status: 400, message: 'Missing fields' })
    const messageId = await sendMessage(senderId, receiverId, body)
    res.json({ status: 200, messageId })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function getConversationController(req: Request, res: Response) {
  try {
    const { userA, userB } = req.query
    if (!userA || !userB) return res.status(400).json({ status: 400, message: 'Missing user IDs' })
    const messages = await getConversation(userA as string, userB as string)
    res.json({ status: 200, data: messages })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function markMessagesAsReadController(req: Request, res: Response) {
  try {
    const { senderId, receiverId } = req.body
    if (!senderId || !receiverId) return res.status(400).json({ status: 400, message: 'Missing user IDs' })
    await markMessagesAsRead(senderId, receiverId)
    res.json({ status: 200, message: 'Messages marked as read' })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

export async function getUserConversationsController(req: Request, res: Response) {
  try {
    const { userId } = req.params
    if (!userId) return res.status(400).json({ status: 400, message: 'Missing userId' })
    const conversations = await getUserConversations(userId)
    res.json({ status: 200, data: conversations })
  } catch (e) {
    serverErrorResponse(res, e)
  }
}

