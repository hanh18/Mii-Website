import express from 'express';
import multer from 'multer';

import userController from '../controller/user.controller';
import categoryController from '../controller/category.controller';
import productController from '../controller/product.controller';

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

// Route manager product
router.get('/product', productController.getProductPage);
router.get('/product/:id', productController.getProductById);
router.post('/product/add', productController.createProduct);
router.post('/product/:id/add-image', upload.fields([{ name: 'image', maxCount: 10 }]), productController.uploadImage);
router.patch('/product/:id/thumbnail', productController.thumbnail);
router.post('/product/:productId/add-category/:categoryId', productController.addCategory);
router.put('/product/edit/:id', productController.editProduct);
router.delete('/product/delete/:id', productController.deleteProduct);

export default router;
