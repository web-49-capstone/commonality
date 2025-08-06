import { Router } from 'express'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
import {
  postGroupMatchController,
  getPendingGroupMatchesByGroupIdController,
  getPendingGroupMatchesByUserIdController,
  getMatchingGroupsController,
  getAcceptedGroupMatchesByUserIdController,
  putGroupMatchController,
  getGroupMatchStatusController,
  getPendingGroupMatchesCountController
} from './group-matching.controller.ts'

const basePath = '/apis/group-matching'
const router: Router = Router()

router.route('/')
  .post(isLoggedInController, postGroupMatchController)
  .get(isLoggedInController, getMatchingGroupsController)

router.route('/pending/user/:userId')
  .get(isLoggedInController, getPendingGroupMatchesByUserIdController)

router.route('/pending/group/:groupId')
  .get(isLoggedInController, getPendingGroupMatchesByGroupIdController)

router.route('/pending/count/:groupId')
  .get(isLoggedInController, getPendingGroupMatchesCountController)

router.route('/accepted/user/:userId')
  .get(isLoggedInController, getAcceptedGroupMatchesByUserIdController)

router.route('/status/:userId/:groupId')
  .get(isLoggedInController, getGroupMatchStatusController)

router.route('/:userId/:groupId')
  .put(isLoggedInController, putGroupMatchController)

export const groupMatchingRoute = { basePath, router }