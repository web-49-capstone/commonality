import { Router } from 'express'
import {
  sendMessageController,
  getConversationController,
  markMessagesAsReadController,
  getUserConversationsController
} from './message.controller.ts'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'

const basePath = '/apis/messages'
const router: Router = Router()

// Send a message
router.route('/')
  .post(isLoggedInController, sendMessageController)

// Get conversation between two users
router.route('/conversation')
  .get(isLoggedInController, getConversationController)

// Mark messages as read
router.route('/read')
  .put(isLoggedInController, markMessagesAsReadController)

// Get all conversations for a user
router.route('/:userId/conversations')
  .get(isLoggedInController, getUserConversationsController)

export const messageRoute = { basePath, router }

