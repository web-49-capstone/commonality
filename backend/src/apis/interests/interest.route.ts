import {Router} from "express";
import {
    getAllInterestsController,
    getInterestByInterestIdController, getInterestByUserIdController,
    postInterestController
} from "./interest.controller.ts";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/interest'
const router = Router()

router.route('/')
    .get(getAllInterestsController)
    .post(isLoggedInController, postInterestController)

router.route('/interestId/:interestId')
    .get(getInterestByInterestIdController)

router.route('/interestUserId/:userInterestUserId')
    .get(getInterestByUserIdController)

export const interestRoute = {basePath, router}