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

    // console.log(req.file)
    // eslint-disable-next-line camelcase
    // let publicId;
    // const cld_upload_stream = await cloudinary.uploader.upload_stream(
    //   {
    //     folder: 'Miii',
    //   },
    //   function (error, result) {
    //     console.log(error, result);
    //     publicId = result.public_id;
    //     console.log(publicId)
    //   }
    // );
    // console.log(cld_upload_stream)

    // await streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
    // console.log(publicId)
    // await cloudinary.uploader.destroy('Miii/v6lkbuqonfw0y30t3fp6', { resource_type: 'image', invalidate: true, type: 'upload' }, (error, result) => { console.log(result, error); });

    

    // console.log(result)
    // const publicId = result.public_id
    // console.log(publicId)

    if (!req.file) {
      console.log('no file');
      return arrResponse.badRequest(res, arrMessage.MESSAGE_REQUIRED_IMAGE);
    }

    // const avatarPath = req.file.path;

    // await prisma.user.update({
    //   where: { id },
    //   data: {
    //     avatar: avatarPath,
    //   },
    // });

    // cloudinary.api.delete_resources(publicId, function(error, result){console.log(result);});
    
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
          return arrResponse.error(res, arrMessage.MESSAGE_DELETE_IMAGE_ERROR);
        }
      },
    );

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
