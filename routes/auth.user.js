import express from 'express';

import authUserController from '../controller/auth.user.controller';

const router = express.Router();

router.get('/active-account/:token', authUserController.activeAccount);
router.get('/generate-password/:token', authUserController.getNewPassword);
router.get('/change-password', authUserController.changePassword);

export default router;
