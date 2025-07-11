import  {Router} from "express";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";
import {getPublicUserByInterestIdController, getUserByUserIdController, putUserController} from "./user.controller.ts";


const basePath = '/apis/users'
const router: Router = Router()

router.route('/:userId')
    .get(getUserByUserIdController)
    .put(isLoggedInController, putUserController)

router.route('/userInterestInterestId/:userInterestInterestId')
    .get(getPublicUserByInterestIdController)

export const userRoute = {basePath, router}