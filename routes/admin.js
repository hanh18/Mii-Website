import express from 'express';

import userController from '../controller/user.controller';

const router = express.Router();

router.get('/user', userController.getUserPage);
router.get('/user/:id', userController.getUserById);
router.delete('/user/delete/:id', userController.deleteUser);
router.post('/user/block/:id', userController.blockUser);

export default router;
