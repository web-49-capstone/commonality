import {Router} from "express";
import {
    deleteUserInterestController,
    getAllInterestsController,
    getInterestByInterestIdController, getInterestByUserIdController, getInterestsByInterestNameController,
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

router.route('/interestByInterestName/:interestName')
.get(getInterestsByInterestNameController)

router.route('/deleteUserInterest/:userInterestInterestId')
    .delete(isLoggedInController, deleteUserInterestController)
router.route('/userInterestUserId')
    .post(isLoggedInController, postUserInterestController)



export const interestRoute = {basePath, router}