import express from 'express';

import authUserController from '../controller/auth.user.controller';

const router = express.Router();

router.get('/active-account/:token', authUserController.activeAccount);

export default router;
