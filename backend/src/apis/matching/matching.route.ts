import {Router} from 'express'
import {
    getAcceptedMatchesByUserIdController,
    postMatchController, putMatchController
} from './matching.controller'
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/matching'
const router = Router()

router.route('/')
    .post(isLoggedInController, postMatchController)


router.route('/acceptedMatches/:matchReceiverId/:matchAccepted')
    .get(isLoggedInController, getAcceptedMatchesByUserIdController)

router.route('/updateMatch/:matchMakerId/:matchReceiverId')
    .put(isLoggedInController, putMatchController)


export const matchingRoute = {basePath, router}