import PromiseRouter from 'express-promise-router';
import {uploadImages} from '../services/cloud/cloudinary.service.mjs';
import sendMail from '../services/cloud/maill.service.mjs';

const router = PromiseRouter();

router.route('/upload').post(async (req, res) => {
  try {
    const {files} = req;
    console.log(files);
    const listFiles = Object.keys(files).map((key) => {
      if (key.includes('fileUpload')) return files[key];
    });

    const resp = await uploadImages(listFiles);
    return res.status(200).json(resp);
  } catch (e) {
    throw new Error('vsdvdv');
  }
});

router.route('/mail').get(async (req, res) => {
  const xx = await sendMail();
  res.status(200).json(xx);
});
export default router;
