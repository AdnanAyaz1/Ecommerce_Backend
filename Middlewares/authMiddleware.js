import { catchAsync } from "../Utils/CatchAsync.js";
import AppError from "../Utils/AppError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../Models/UserModel.js";

export const authenticate = catchAsync(async (req, res, next) => {
  const uid = req.headers["authorization"];
  const token = uid.split("Bearer ")[1];

  if (!token) {
    return next(new AppError("Please Sign In To Access This Resource"));
  }
  const payload = jwt.verify(token, process.env.JWT_KEY);
  const user = await userModel.findById(payload.id);
  req.user = user;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are Not Authorized To Access This Resouce", 403)
      );
    }
    next();
  };
};
