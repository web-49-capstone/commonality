import { Router } from 'express'
import { signupUserController } from './sign-up.controller'
import {activationController} from "./activation.controller.ts";


const basePath = '/apis/sign-up' as const

const router = Router()

router.route('/').post(signupUserController)

router.route('/activation/:userActivationToken').get(activationController)

export const  signUpRoute= { basePath, router}


