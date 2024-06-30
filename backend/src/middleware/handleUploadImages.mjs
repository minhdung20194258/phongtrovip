import {uploadImages} from '../services/cloud/cloudinary.service.mjs';

/**
 * @param req {import('express').Request}
 * @param res {import('express').Response}
 * @param next {import('express').NextFunction}
 * @return {Promise}
 */
export default async function uploadImageMiddleware(req, res, next) {
  const {files = {}} = req;
  const fileKeys = files ? Object.keys(files) : [];
  req.images = (await uploadImages(fileKeys.map((key) => files[key]))) || [];

  return next();
}
