import {Router} from "express";
import {
    getAllInterestsController,
    getInterestByInterestIdController,
    postInterestController
} from "./interest.controller.ts";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";

const basePath = '/apis/interest'
const router = Router()

router.route('/')
    .get(getAllInterestsController)
    .post(isLoggedInController, postInterestController)

router.route('/:interestId')
    .get(getInterestByInterestIdController)

export const interestRoute = {basePath, router}