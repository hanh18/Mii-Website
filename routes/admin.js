import express from 'express';
import multer from 'multer';

import userController from '../controller/user.controller';
import categoryController from '../controller/category.controller';

import storageCloudinary from '../utils/cloudinary';

const router = express.Router();

const folder = 'Mii';
const upload = multer({ storage: storageCloudinary(folder) });

// Route managar user
router.get('/user', userController.getUserPage);
router.get('/user/:id', userController.getUserById);
router.delete('/user/delete/:id', userController.deleteUser);
router.post('/user/block/:id', userController.blockUser);

// Route manager category
router.get('/category', categoryController.getCategoryPage);
router.get('/category/:id', categoryController.getCategoryById);
router.post('/category/add', upload.single('thumbnail'), categoryController.createCategory);
router.put('/category/edit/:id', upload.single('thumbnail'), categoryController.editCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

export default router;
