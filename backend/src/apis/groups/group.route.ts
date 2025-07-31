import { Router } from 'express'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'
import {
  deleteGroupController,
  getGroupsByInterestController,
  getGroupsController,
  getMatchingGroupsController,
  postGroupController,
  putGroupController,
  getGroupByIdController,
  getGroupsByUserIdController
} from './group.controller.ts'

const basePath = '/apis/groups'
const router: Router = Router()

router.route('/')
  .post(isLoggedInController, postGroupController)
  .get(getGroupsController)

router.route('/matching')
    .get(isLoggedInController, getMatchingGroupsController)

router.route('/user/:userId')
  .get(getGroupsByUserIdController)

router.route('/:groupId')
  .get(getGroupByIdController)
  .put(isLoggedInController, putGroupController)
  .delete(isLoggedInController, deleteGroupController)

router.route('/interest/:interestId')
    .get(getGroupsByInterestController)


export const groupRoute = { basePath, router }
