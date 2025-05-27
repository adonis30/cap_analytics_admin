import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.xlsx' && ext !== '.csv') {
    return cb(new Error('Only .xlsx and .csv files are allowed'), false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
