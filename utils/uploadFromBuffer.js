import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export default (req) => new Promise((resolve, reject) => {
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
