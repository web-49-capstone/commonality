import  {Router} from "express";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";
import {getUserByUserIdController, putUserController} from "./user.controller.ts";


const basePath = '/apis/users'
const router: Router = Router()

router.route('/:userId')
    .get(getUserByUserIdController)
    .put(isLoggedInController, putUserController)
export const userRoute = {basePath, router}
