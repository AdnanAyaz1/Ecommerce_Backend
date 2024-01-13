import jwt from "jsonwebtoken";

export const getToken = (user, res, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
    avatar: {
      id: user?.avatar?.id,
      url: user?.avatar?.url,
    },
  };

  res.status(code).json({
    msg: message,
    user: userData,
    token,
  });
};
