import {Router} from 'express'
import {
    getAcceptedMatchesByUserIdController,
    getMatchesByMatchReceiverIdController,
    postMatchController
} from './matching.controller'
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/matching'
const router = Router()

router.route('/')
    .post(isLoggedInController, postMatchController)

router.route('/acceptedMatches/:userId')
    .get(isLoggedInController, getAcceptedMatchesByUserIdController)

router.route('/:userId')
    .get(isLoggedInController, getMatchesByMatchReceiverIdController)

export const matchingRoute = {basePath, router}