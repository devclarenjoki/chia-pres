import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`; // Generate a unique filename using UUID
    cb(null, fileName);
  },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedAudioFormats = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a'];
  const allowedVideoFormats = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv'];

  if (
    (file.fieldname === 'fileUrl' && file.mimetype.startsWith('audio/') && allowedAudioFormats.includes(file.mimetype)) ||
    (file.fieldname === 'fileUrl' && file.mimetype.startsWith('video/') && allowedVideoFormats.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only audio or video files are allowed.'), false);
  }
};

// Configure Multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 10MB file size limit
}).single('fileUrl');

const uploadMiddleware = (req, res, next) => {
  // console.log(req, "request")
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    req.body.fileUrl = req.file.path;
    next();
  });
};

export default uploadMiddleware;