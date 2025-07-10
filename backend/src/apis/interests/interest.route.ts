import {Router} from "express";
import {
    deleteUserInterestByInterestIdController,
    getAllInterestsController,
    getInterestByInterestIdController, getInterestByUserIdController,
    postInterestController, postUserInterestController
} from "./interest.controller.ts";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/interest'
const router = Router()

router.route('/')
    .get(getAllInterestsController)
    .post(isLoggedInController, postInterestController)

router.route('/interestId/:interestId')
    .get(getInterestByInterestIdController)

router.route('/userInterestUserId/:userInterestUserId')
    .get(getInterestByUserIdController)

router.route('/deleteUserInterestByInterestId/:userInterestInterestId')
    .delete(isLoggedInController, deleteUserInterestByInterestIdController)
router.route('/userInterestUserid')
    .post(isLoggedInController, postUserInterestController)

export const interestRoute = {basePath, router}