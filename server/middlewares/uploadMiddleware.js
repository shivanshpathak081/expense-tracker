import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP images and PDF files are allowed'), false);
  }
};

const uploadToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'expense-tracker',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const upload = {
  single(fieldName) {
    const multerSingle = memoryUpload.single(fieldName);

    return (req, res, next) => {
      multerSingle(req, res, async (error) => {
        if (error) return next(error);
        if (!req.file) return next();

        try {
          const result = await uploadToCloudinary(req.file);
          req.file.path = result.secure_url;
          req.file.filename = result.public_id;
          return next();
        } catch (uploadError) {
          return next(uploadError);
        }
      });
    };
  },
};

export default upload;
