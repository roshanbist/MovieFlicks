import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// configuraiton
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// upload files
export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // remove the file from the temporary storage after the upload completes
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    // unlink or remove the file from the temporary storage if there is any error during upload
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteFromCloudinary = async (id) => {
  await cloudinary.uploader.destroy(id);
};
