import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';
import uploadFromBuffers from '../utils/uploadFromBuffer';
import destroyUploadImage from '../utils/destroyUploadImage';

const prisma = new PrismaClient();

const getChangeAvata = (req, res) => {
  try {
    arrResponse.success(res);
  } catch (error) {
    throw new Error(error);
  }
};

const changeAvata = async (req, res) => {
  try {
    // get id from cookies
    const id = parseInt(req.body.id, 10);

    if (!req.file) {
      console.log('no file');
      return arrResponse.badRequest(res, arrMessage.MESSAGE_REQUIRED_IMAGE);
    }

    // upload image
    const resultUpload = await uploadFromBuffers(req);

    // update user
    const publicId = resultUpload.public_id;
    const avatarPath = resultUpload.url;

    // eslint-disable-next-line no-inner-declarations
    async function runUpdate() {
      await prisma.user.update({
        where: { id },
        data: {
          avatar: avatarPath,
        },
      });
    }

    runUpdate()
      .catch(async (e) => {
        destroyUploadImage(publicId);
        throw e;
      });

    arrResponse.success(res);
  } catch (error) {
    console.log(error);
    arrResponse.serverError(res);
  }
};

export default {
  getChangeAvata,
  changeAvata,
};
