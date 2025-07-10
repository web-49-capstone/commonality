import { signInController } from './sign-in.controller.ts'
import { Router } from 'express'

const basePath = '/apis/sign-in' as const
const router = Router()
router.route('/').post(signInController)
export const signInRoute = { basePath, router }
