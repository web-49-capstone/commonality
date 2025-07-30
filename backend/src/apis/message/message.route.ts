import {Router} from "express";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";
import {
    getLastMessagesWithPartnerInfoController,
    postMessageController,
    getUnreadMessagesByUserIdController, deleteMessageController, getMessageBySenderAndReceiverController
} from "./message.controller.ts";
import {updateMessageWhenOpened} from "./message.model.ts";


const basePath = '/apis/message'

const router = Router()

router.route('/')
.post(isLoggedInController, postMessageController)

router.route('/messageThread/:userId')
    .get(isLoggedInController, getMessageBySenderAndReceiverController)

// router.route('/openMessages/:messageId')
// .put(isLoggedInController, getMessageBySenderAndReceiverController)

router.route('/:messageReceiverId/unread')
    .get(isLoggedInController, getUnreadMessagesByUserIdController)

router.route('/:userId/lastMessage')
.get(isLoggedInController, getLastMessagesWithPartnerInfoController)

router.route('/delete/:messageId')
    .delete(isLoggedInController, deleteMessageController)

export const messageRoute = { basePath, router }