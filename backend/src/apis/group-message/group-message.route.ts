import { Router } from 'express'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
import {
  postGroupMessageController,
  getGroupMessagesController,
  deleteGroupMessageController,
  checkGroupMembershipController
} from './group-message.controller.ts'

const basePath = '/apis/group-messages'
const router: Router = Router()

router.route('/')
  .post(isLoggedInController, postGroupMessageController)

router.route('/group/:groupId')
  .get(getGroupMessagesController)

router.route('/check-membership/:groupId')
  .get(isLoggedInController, checkGroupMembershipController)

router.route('/:groupMessageId')
  .delete(isLoggedInController, deleteGroupMessageController)

export const groupMessageRoute = { basePath, router }