import { ProductsModel } from "../Models/ProductModel.js";
import ApiFeatures from "../Utils/ApiFeatures.js";
import cloudinary from "cloudinary";
import fs from "fs";
import { catchAsync } from "../Utils/CatchAsync.js";

export const createProduct = catchAsync(async (req, res, next) => {
  let images = [];
  if (req?.files) {
    for (const file of req.files.image) {
      const image = file.tempFilePath;
      const myImage = await cloudinary.v2.uploader.upload(image);
      images.push(myImage);
    }
    fs.rmSync("./tmp", { recursive: true });
  }

  const { name, price, description, category, stock } = req.body;
  const newProduct = await ProductsModel.create({
    name,
    price,
    description,
    category,
    images,
    stock,
  });

  await newProduct.save({ validateBeforeSave: false });
  res.status(201).json({
    msg: "Product Created Successfully",
    newProduct,
  });
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const Feature = new ApiFeatures(ProductsModel.find(), req.query)
    .search()
    .filter();

  const allProducts = await Feature.query;
  res.status(200).json({
    noOfProducts: allProducts.length,
    allProducts,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  let images = [];
  if (req?.files) {
    for (const file of req.files.image) {
      const image = file.tempFilePath;
      const myImage = await cloudinary.v2.uploader.upload(image);
      images.push(myImage);
    }
    fs.rmSync("./tmp", { recursive: true });
  }
  // const { name, price, description, category } = req.body;
  const updatedProduct = await ProductsModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    msg: "Product Updated Successfully",
    updatedProduct,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  await ProductsModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    msg: "Item Deleted SuccessFully",
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const Product = await ProductsModel.findById(req.params.id);
  res.status(200).json({
    Product,
  });
});

export const CreateReview = catchAsync(async (req, res, next) => {
  const product = await ProductsModel.findById(req.params.id);

  let review = {
    name: req.body.name,
    ratings: req.body.ratings,
    comment: req.body.comment,
  };
 
  product?.reviews.push(review);

  const totalReviews = product.reviews.length;
  let sum = 0;
  product.reviews.forEach((el) => (sum += el.ratings));
  const AverageRatings = sum / totalReviews;
  product.ratings = AverageRatings;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    msg: "Review Added",
    product,
  });
});

export const deleteAllReviews = catchAsync(async (req, res, next) => {
  const product = await ProductsModel.findById(req.params.id);
  product.reviews = [];
  product.ratings = 0;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    msg: "Reviews Deleted",
    product,
  });
});

export const deleteSingleReview = catchAsync(async (req, res, next) => {
  const product = await ProductsModel.findById(req.params.id);

  product.reviews = product.reviews.filter(
    (rev) => !(rev.name == req.body.name)
  );

  const totalReviews = product.reviews.length;
  let sum = 0;
  product.reviews.forEach((el) => (sum += el.ratings));
  const AverageRatings = sum / totalReviews;
  product.ratings = AverageRatings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    msg: "Review Deleted",
    product,
  });
});

export const FeaturedProducts = catchAsync(async (req, res, next) => {
  const categories = ["shoes", "electronics", "clothing"];

  let products = [];
  for (const category of categories) {
    const product = await ProductsModel.find({ category })
      .limit(2)
      .sort("price");
    products.push(...product);
  }

  res.json({ products });
});

export const SimilarProducts = catchAsync(async (req, res, next) => {
  const { cat } = req.params;
  const products = await ProductsModel.find({ category: cat });
  res.json({ products });
});
