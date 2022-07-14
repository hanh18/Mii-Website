import { v2 as cloudinary } from 'cloudinary';

export default (publicId) => {
  cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: 'image',
      invalidate: true,
      type: 'upload',
    },
    (error, result) => {
      console.log(result);
      if (error) {
        console.log(error);
      }
    },
  );
};
