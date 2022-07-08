import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { v2 as cloudinary } from 'cloudinary';

// export default storageCloudinary;
export default (folder) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // eslint-disable-next-line no-return-assign, no-undef
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
    },
  });

  return storage;
};
