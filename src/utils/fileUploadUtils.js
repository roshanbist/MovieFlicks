import { uploadOnCloudinary } from './cloudinaryConfig.js';

export const uploadFileGetUrls = async (incomingFiles) => {
  if (Array.isArray(incomingFiles)) {
    const uploadedFilesUrl = [];
    const filesCloudinaryId = [];

    for (const file of incomingFiles) {
      const { public_id, url } = await uploadOnCloudinary(file.path);

      uploadedFilesUrl.push(url);
      filesCloudinaryId.push(public_id);
    }
    return { uploadedFilesUrl, filesCloudinaryId };
  } else {
    const { public_id, url } = await uploadOnCloudinary(incomingFiles.path);

    return { public_id, url };
  }
};
