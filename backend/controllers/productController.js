import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category
    ? {
        category: req.query.category,
      }
    : {};

  const count = await Product.countDocuments({ ...keyword, ...category }).maxTimeMS(30000);
  const products = await Product.find({ ...keyword, ...category }).maxTimeMS(30000);

  console.log(res.json)

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  console.log(req.body)
  const image = req.files['image'].path;
  // const fileUrl = req.files['fileUrl'][0].path;

  if (!req.user) {
    res
      .status(401)
      .json({ error: 'User not authenticated. Login/Sign in to continue' });
    return;
  }

  const userProductsCount = await Product.countDocuments({
    user: req.user._id,
  });
  const maxUploads = 100;

  if (userProductsCount >= maxUploads) {
    if (req.user.isUpgraded) {
      // Allow upload for upgraded account
      const uniqueLink = generateUniqueLink();
      const product = new Product({
        name,
        price,
        image,
        // fileUrl,
        user: req.user._id,
        category,
        numReviews: 0,
        description,
        link: uniqueLink,
      });
      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } else {
      res.status(400).json({
        error:
          'You have reached the maximum number of uploads. Please upgrade your account to enjoy unlimited uploads.',
        upgradeRequired: true,
      });
    }
  } else {
    const uniqueLink = generateUniqueLink();
    const product = new Product({
      name,
      price,
      image,
      // fileUrl,
      user: req.user._id,
      category,
      numReviews: 0,
      description,
      link: uniqueLink,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  }
});

function generateUniqueLink() {
  const randomString = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  return randomString + timestamp;
}

const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id });
  res.json(products);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts
};
