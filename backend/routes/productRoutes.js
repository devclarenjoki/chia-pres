import express from 'express';
const router = express.Router();
import path from 'path';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';
import multer from 'multer';

// protect, admin,

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
  const allowedImageFormats = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedVideoFormats = [
    'video/mp4',
    'video/mov',
    'video/avi',
    'video/wmv',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
  ];

  if (
    (file.fieldname === 'image' &&
      allowedImageFormats.includes(file.mimetype))
    // (file.fieldname === 'fileUrl' &&
    //   allowedVideoFormats.includes(file.mimetype))
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file format. Only images are allowed.'),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

const uploadFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  // { name: 'fileUrl', maxCount: 1 },
]);

router.route('/').get(getProducts).post(protect, uploadFiles, createProduct);
// router.route('/category/:category').get(getProducts);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router.get('/top', getTopProducts);
router.route('/mine').get(protect, getMyProducts);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
