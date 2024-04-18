import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

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


const upload = multer({ storage, fileFilter,   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});
const uploadSingleMedia = upload.single('fileUrl');

router.post('/', (req, res) => {
  uploadSingleMedia(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    res.status(200).send({
      message: 'Media uploaded successfully',
      fileUrl: `/${req.file.path}`,
    });
  });
});

export default router;