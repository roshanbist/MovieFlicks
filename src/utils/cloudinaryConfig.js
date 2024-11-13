import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    return null;
  }

  const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: 'auto',
  });

  return response;
};

export const deleteFromCloudinary = async (id) => {
  await cloudinary.uploader.destroy(id);
};
