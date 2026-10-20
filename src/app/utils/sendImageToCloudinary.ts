import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});
export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(path, {
        public_id: imageName,
        folder: 'PHU', // Specify folder
        format: 'avif', // Convert and save the image as AVIF format
      })
      .then((uploadResult) => {
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url(uploadResult.public_id, {
          fetch_format: 'avif', // Ensure delivery in AVIF format
          quality: 'auto',
        });
        resolve({ url: optimizeUrl });

        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('File is deleted.');
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
  /*
    (async function () {
      // Transform the image: auto-crop to square aspect_ratio
      // const autoCropUrl = cloudinary.url('shoes', {
      //   crop: 'auto',
      //   gravity: 'auto',
      //   width: 500,
      //   height: 500,
      // });
      // console.log(autoCropUrl);
      // console.log(autoCropUrl);
    })();
  */
};

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
