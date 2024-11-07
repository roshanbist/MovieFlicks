import { uploadOnCloudinary } from './cloudinaryConfig.js';

export const uploadFileGetUrls = async (files) => {
  console.log('files', files);

  const uploadedFilesUrl = [];
  const filesCloudinaryId = [];

  for (const file of files) {
    const { public_id, url } = await uploadOnCloudinary(file.path);

    uploadedFilesUrl.push(url);
    filesCloudinaryId.push(public_id);
  }

  return { uploadedFilesUrl, filesCloudinaryId };
};
