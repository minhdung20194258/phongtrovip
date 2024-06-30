/* eslint-disable no-unused-vars */
import cloudinary from '../../config/cloud/cloudinary.mjs';
import {deleteTempFile} from '../../helpers/controlFile.mjs';
import streamifier from 'streamifier';

/**
 * @param buffer
 * @return {Promise<{assetId: *, publicId: *, url: *}>}
 */
export const uploadBufferImage = async (buffer) => {
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {upload_preset: 'ml_default'},
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    url: result.url,
  };
};

/**
 * @param file
 * @return {Promise<{assetId: *, publicId: *, url: *}>}
 */
export const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(
    file.tempFilePath,
    {
      public_id: `${new Date().getTime()}`,
      resource_type: 'image',
    },
    async function (error) {
      console.log(`Upload cloudinary error: `, error);
      deleteTempFile(file.tempFilePath);
    },
  );

  return {
    assetId: result.asset_id,
    publicId: result.public_id,
    url: result.url,
  };
};

/**
 * @param files  {import('express-fileupload')[]}
 * @return {Promise<{assetId: *, publicId: *, url: *}[]>}
 */
export const uploadImages = async (files = []) => {
  const results = await Promise.all(
    files.map((file, index) =>
      cloudinary.uploader.upload(
        file.tempFilePath,
        {
          public_id: `${new Date().getTime()}`,
          resource_type: 'image',
        },
        async function (error) {
          console.log(`Upload cloudinary ${index} error: `, error);
          deleteTempFile(file.tempFilePath);
        },
      ),
    ),
  );

  return results.map((res) => ({
    assetId: res.asset_id,
    publicId: res.public_id,
    url: res.url,
  }));
};

/**
 * @param publicId
 * @return {Promise<*>}
 */
export const deleteImage = async (publicId) => {
  /** @type {{deleted: string}} */
  const result = await cloudinary.api.delete_resources(publicId, {
    type: 'upload',
    resource_type: 'image',
  });
  return result.deleted;
};
