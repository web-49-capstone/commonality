import {Router} from 'express'
import {
    getAcceptedMatchesByUserIdController,
    getMatchesByMatchReceiverIdController,
    postMatchController, putMatchController
} from './matching.controller'
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/matching'
const router = Router()

router.route('/')
    .post(isLoggedInController, postMatchController)
    .put(isLoggedInController, putMatchController)

router.route('/acceptedMatches/:userId')
    .get(isLoggedInController, getAcceptedMatchesByUserIdController)

router.route('/:userId')
    .get(isLoggedInController, getMatchesByMatchReceiverIdController)


export const matchingRoute = {basePath, router}