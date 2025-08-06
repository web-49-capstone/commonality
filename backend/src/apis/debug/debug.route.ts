import { Router } from 'express'
import { debugSessionController, debugMessagesController } from './debug.controller'

const router = Router()

router.get('/debug/session', debugSessionController)
router.get('/debug/messages', debugMessagesController)

export default router

export const debugRoute = {
    basePath: '/',
    router
}