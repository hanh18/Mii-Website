import express from 'express';
import multer from 'multer';

import clientController from '../controller/client.controller';
import storageCloudinary from '../utils/cloudinary';

const storage = multer.memoryStorage()


const router = express.Router();

const folder = 'Mii';
const upload = multer({ storage });

router.get('/change-avatar', clientController.getChangeAvata);
router.post('/change-avatar', upload.single('avatar'), clientController.changeAvata);

export default router;
