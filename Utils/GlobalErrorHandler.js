import AppError from "./AppError.js";

export const GlobalErrorHAndler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // duplicate key error
  if (err.code === 11000) {
    err = new AppError(`${Object.keys(err.keyValue)} already exist`, 400);
  }
  // Missing field Error (Validation)
  if (err?.errors) {
    const val = Object.keys(err.errors)[0];
    //   console.log(err.errors[val].message)
    err = new AppError(`${err.errors[val].message} `, 400);
  }
  // Wrong ID
  if (err.name === "CastError") {
    err = new AppError(`THE ID : ${err.value} is not valid`, 400);
  }
  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }
  //response
  res.status(err.statusCode).send({
    err,
    message: err.message,
    stack: err.stack,
  });
};
