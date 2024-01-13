import { catchAsync } from "../Utils/CatchAsync.js";
import { userModel } from "../Models/UserModel.js";
import { hashPassword } from "../Utils/hashPassword.js";
import { comparePassword } from "../Utils/hashPassword.js";
import cloudinary from "cloudinary";
import { getToken } from "../Utils/getJWT.js";
import AppError from "../Utils/AppError.js";
import { sendEmail } from "../Utils/Email.js";
import fs from "fs";

export const createNewUser = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // hash the password
  const hashedPassword = await hashPassword(password?.toString());

  // compare the password fields
  if (password.toString() !== confirmPassword.toString()) {
    return next(new AppError("The Passwords Do not Match", 400));
  }

  const otp = Math.floor(Math.random() * 1000);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpires: Date.now() + 5 * 60 * 1000,
  });

  await sendEmail({
    email,
    subject: "Account Verification",
    message: `Your Account Verification Otp is ${otp}`,
  });

  getToken(
    newUser,
    res,
    201,
    "OTP HAS BEEN SENT TO YOUR EMAIL, PLEASE VERIFY YOUR ACCOUNT"
  );
});

export const verify = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const user = await userModel.findOne({
    otp,
    otpExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(new AppError("Otp is Invalid or has Expired", 400));
  }
  user.verified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save({ validateBeforeSave: true });
  getToken(user, res, 200, "Account Verified");
});

export const Login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter Email and Password"));
  }
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("The Email or Password is Invalid", 400));
  }

  const matchPassword = await comparePassword(password, user.password);

  if (!matchPassword) {
    return next(new AppError("The Password or Email  is Invalid", 400));
  }
  getToken(user, res, 200, "Login Successful");
});

export const resendVerificationOtp = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const otp = Math.floor(Math.random() * 100000);
  const user = await userModel.findOneAndUpdate(
    { name },
    { otp, otpExpires: Date.now() + 5 * 60 * 1000 }
  );

  if (!user) {
    return next(new AppError("No User found with the given id", 400));
  }
  await sendEmail({
    email: user.email,
    subject: "Account Verification",
    message: `Your Account Verification Otp is ${otp}`,
  });
  res.status(200).json({
    msg: "An Otp is Resent to Your Email",
  });
});

export const Logout = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    msg: "Logout Successfull",
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please Enter an Email", 400));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError("The email is Not Valid", 404));
  }

  const resetToken = Math.floor(Math.random() * 100000);
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpires = Date.now() + 5 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const message = `Your Password Reset Token Is : ${resetToken} `;

  await sendEmail({
    email: user.email,
    subject: "Password Recovery",
    message,
  });

  res.status(200).send({
    msg: "Email Sent to Your Account",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetPasswordToken, password, confirmPassword } = req.body;
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordTokenExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(
      new AppError("The Reset Password Token is Invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("The PAssword Does not Match", 400));
  }
  const hashedPassword = await hashPassword(password?.toString());
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  getToken(user, res, 200, "Password Reset SuccessFull");
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  res.status(200).json({
    user,
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword } = req.body;
  if (!oldPassword) {
    return next(new AppError("Please Enter Old Password", 400));
  }

  const user = await userModel.findById(req.user._id).select("+password");

  const isMatched = await comparePassword(oldPassword, user.password);

  if (!isMatched) {
    return next(new AppError("Old PAssword is Incorrect", 400));
  }

  if (!req.body.newPassword) {
    return next(new AppError("Please Enter A new Password", 400));
  }
  console.log(req.body.newPassword, req.body.confirmPassword);
  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new AppError("The Passwords do not match", 400));
  }

  user.password = await hashPassword(req.body.newPassword);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    msg: "Password Updated",
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  let update = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.email) {
    update.email = req.body.email;
  }

  if (req.files) {
    if (req.files.avatar?.id) {
      await cloudinary.v2.uploader.destroy(req?.files?.avatar?.id);
    }
    console.log("TAKING FILES", req.files);
    const image = await cloudinary.v2.uploader.upload(
      req.files.avatar.tempFilePath
    );
    update.avatar.url = image.secure_url;
    update.avatar.id = image.public_id;
    console.log("up", update);
    fs.rmSync("./tmp", { recursive: true });
  }

  const updatedUser = await userModel.findByIdAndUpdate(req.user._id, update, {
    new: true,
  });

  getToken(updatedUser, res, 200, "User Updated");
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await userModel.find();
  res.status(200).json({
    allUsers,
  });
});

export const getSingleUser = catchAsync(async (req, res, next) => {
  const allUsers = await userModel.findById(req.params.id);
  res.status(200).json({
    allUsers,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const allUsers = await userModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    allUsers,
  });
});

// export const  = catchAsync(async(req,res,next)=>{

// })
// export const  = catchAsync(async(req,res,next)=>{

// })
// export const  = catchAsync(async(req,res,next)=>{

// })
