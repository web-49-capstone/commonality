import { Router } from 'express'
import { getAllInterestsController, getUserInterestsController, putUserInterestsController } from './interest.controller.ts'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'

const basePath = '/apis/interests'
const router: Router = Router()

router.route('/')
  .get(getAllInterestsController)

router.route('/user/:userId')
  .get(getUserInterestsController)
  .put(isLoggedInController, putUserInterestsController)

export const interestRoute = { basePath, router }

