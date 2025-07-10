import { Router } from 'express';
import { postMatchController } from './match.controller';
import { isLoggedInController } from '../../utils/controllers/is-logged-in.controller';

const router = Router();

router.route('/')
    .post(isLoggedInController, postMatchController);

export const matchRoute = {
    basePath: '/apis/match',
    router
};
