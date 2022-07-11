import express from 'express';

import authAdminController from '../controller/auth.admin.controller';

const router = express.Router();

router.get('/login', authAdminController.getLoginAdminPage);
router.post('/login', authAdminController.handleLogin);
router.get('/logout', authAdminController.logout);

export default router;
