import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

import arrResponse from '../utils/response';
import arrMessage from '../utils/message';

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
    const uploadFromBuffer = () => new Promise((resolve, reject) => {
      const cldUploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'Mii',
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      streamifier.createReadStream(req.file.buffer).pipe(cldUploadStream);
    });

    const resultUpload = await uploadFromBuffer();
    const publicId = resultUpload.public_id;
    const avatarPath = resultUpload.url;

    // update user
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
        await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: 'image',
            invalidate: true,
            type: 'upload',
          },
          (error, result) => {
            if (error) {
              console.log(error);
            }
          },
        );

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
