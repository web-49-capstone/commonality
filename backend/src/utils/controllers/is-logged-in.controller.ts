import type {NextFunction, Request, Response} from "express";
import pkg from "jsonwebtoken";
import type {Status} from "../interfaces/Status.ts";
import type {PublicUser} from "../../apis/users/user.model.ts";

const { verify } = pkg

export function isLoggedInController(request: Request, response: Response, next: NextFunction): void {
    const status: Status = {status:401, message: 'please login', data:null}
    try {
        console.log(request.session.signature)
        const user: PublicUser | undefined = request.session?.user
        const signature: string | undefined = request.session?.signature ?? ''
        const unverifiedJwtToken: string | undefined = request.headers?.authorization
        if (user === undefined || signature === undefined || unverifiedJwtToken === undefined) {
            response.json(status)
            return
        }

        if ( !unverifiedJwtToken || unverifiedJwtToken !== request.session?.jwt) {
            response.json(status)
            return
        }
        verify(unverifiedJwtToken, signature)

        next()
    } catch (error: unknown) {
        response.json(status)
    }
}