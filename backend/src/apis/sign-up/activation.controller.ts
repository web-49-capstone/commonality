import type { Request, Response } from 'express'
import {
  PrivateUserSchema,
  selectPrivateUserByUserActivationToken,
  updateUser
} from '../users/user.model'
import { zodErrorResponse } from '../../utils/response.utils'

export async function activationController (request: Request, response: Response): Promise<void> {
  try {
    const validationResult = PrivateUserSchema
      .pick({ userActivationToken: true }).safeParse(request.params)
    if (!validationResult.success) {
      zodErrorResponse(response, validationResult.error)
      return
    }

    const { userActivationToken } = validationResult.data

    const user = await selectPrivateUserByUserActivationToken(userActivationToken)

    if (user === null) {
      response.json({
        status: 400,
        data: null,
        message: 'Account activation has failed. Have you already created this account?'
      })
      return
    }
    user.userActivationToken = null
    await updateUser(user)
    response.json({
      status: 200,
      data: null,
      message: 'Account activation was successful'
    })
  } catch (error) {
    console.error(error)
    response.json({ status: 500, data: null, message: 'internal server error, try again later' })
  }
}
