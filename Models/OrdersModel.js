import { Schema, model } from "mongoose";

const orderScehma = new Schema({
  shippingInfo: {
    country: {type:String,required:[true,'Enter a Country name']},
    city: {type:String,required:[true,'Enter a City name']},
    state: {type:String,required:[true,'Enter a State name']},
    pincode:{type:Number,required:[true,'Enter a PinCode']},
    phoneNo: {type:Number,required:[true,'Enter Phone No']},
  },
  productDetails: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  userDetails: String,
  totalAmount:Number,
  status: {
    type: String,
    default: "pending",
  },
  DeliveredAt: Date,
  ShippedAt:Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const orderModel = model("orderModel", orderScehma);
