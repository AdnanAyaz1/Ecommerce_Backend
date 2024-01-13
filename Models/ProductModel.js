import { Schema, model } from "mongoose";

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter a Product Name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please Enter a Product Price"],
  },
  description: {
    type: String,
    required: [true, "Please Enter a Product Description"],
  },
  category: {
    type: String,
    required: [true, "Please Enter a Product Category"],
  },
  images: [
    {
      path: String,
      url: String,
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 1,
  },
  quantity:{
    type:Number,
    default:1
  },
  reviews: [
    {

      name: String,
      ratings: Number,
      comment: String,
    },
  ],
});

export const ProductsModel = model("ProductsModel", productsSchema);
