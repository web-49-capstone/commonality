import {Router} from "express";
import {
    deleteGroupInterestController,
    getInterestByGroupIdController,
    postGroupInterestController
} from "./group-interest.controller.ts";
import {isLoggedInController} from "../../utils/controllers/is-logged-in.controller.ts";
import {getInterestByUserIdController} from "../interests/interest.controller.ts";

const basePath = '/apis/group-interest'
const router = Router()

router.route('/')
    .post(isLoggedInController, postGroupInterestController)

router.route('/')
    .delete(isLoggedInController, deleteGroupInterestController)
router.route('/:groupId')
    .get(getInterestByGroupIdController)

export const groupInterestRoute = {basePath, router}
