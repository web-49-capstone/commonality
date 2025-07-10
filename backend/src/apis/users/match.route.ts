import { Router } from 'express'
import { swipeMatchController, getMutualMatchesController, getPendingMatchesController } from './match.controller.ts'
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller.ts'

const basePath = '/apis/matches'
const router: Router = Router()

// Swipe (create match or accept mutual)
router.route('/')
  .post(isLoggedInController, swipeMatchController)

// Get all mutual matches for a user
router.route('/:userId/mutual')
  .get(isLoggedInController, getMutualMatchesController)

// Get all pending matches for a user
router.route('/:userId/pending')
  .get(isLoggedInController, getPendingMatchesController)

export const matchRoute = { basePath, router }

