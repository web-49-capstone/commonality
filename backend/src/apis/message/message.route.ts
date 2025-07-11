import {Router} from "express";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";
import {
    getLastMessagesWithPartnerInfoController,
    getMessageByUserIdController,
    postMessageController,
    getUnreadMessagesByUserIdController
} from "./message.controller.ts";


const basePath = '/apis/message'

const router = Router()

router.route('/')
.post(isLoggedInController, postMessageController)

router.route('/:userId')
.get(isLoggedInController, getMessageByUserIdController)

router.route('/:userId/unread')
    .get(isLoggedInController, getUnreadMessagesByUserIdController)

router.route('/:userId/lastMessage')
.get(isLoggedInController, getLastMessagesWithPartnerInfoController)

export const messageRoute = { basePath, router }