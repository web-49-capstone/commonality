import {Router} from 'express'
import {
    getAcceptedMatchesByUserIdController,
    getCheckIfMatchExistsBetweenTwoUsers,
    getDeclinedMatchesByUserIdController,
    postMatchController,
    putMatchController
} from './matching.controller'
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/matching'
const router = Router()

router.route('/')
    .post(isLoggedInController, postMatchController)


router.route('/accepted/:userId')
    .get(isLoggedInController, getAcceptedMatchesByUserIdController)
router.route('/declined/:userId')
    .get(isLoggedInController, getDeclinedMatchesByUserIdController)
router.route('/pending/:matchMakerId')
    .get(isLoggedInController, getCheckIfMatchExistsBetweenTwoUsers)

router.route('/updateMatch/:matchMakerId/:matchReceiverId')
    .put(isLoggedInController, putMatchController)


export const matchingRoute = {basePath, router}