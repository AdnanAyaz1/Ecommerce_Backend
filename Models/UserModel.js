import { Schema, model } from "mongoose";

import validator from "validator";
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter a User Name"],
    trim: true,
    unique: [true, "The name is Already Taken"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: [true, "THE EMAIL EXISTS"],
    validate: [validator.isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Password"],
    min: [3, "The password should be atleast 3 characters"],
    select: false,
  },
  avatar: {
    id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  verified:{
    type:Boolean,
    default:false
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  otp:Number,
  otpExpires:Date
});

export const userModel = model("userModel", userSchema);


userSchema.index({otpExpires:1},{expireAfterSeconds:5})