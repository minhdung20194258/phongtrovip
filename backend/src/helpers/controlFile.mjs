import fs from 'fs';
import {uploadImages} from '../services/cloud/cloudinary.service.mjs';

/**
 * @param filePath
 */
export const deleteTempFile = function (filePath) {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
    console.log(`File ${filePath} was deleted`);
  });
};

export const uploadFilePost = async (files, oldImages) => {
  const fileKeys = files ? Object.keys(files) : [];
  const imagesRaw = await uploadImages(fileKeys.map((key) => files[key]));
  const images = imagesRaw.map((img, i) => ({
    ...img,
    index: parseInt(fileKeys[i].replace(/\D/g, ''), 10),
  }));

  if (!Array.isArray(oldImages)) return images;
  return [...images, ...oldImages].sort((a, b) => a.index - b.index);
};
