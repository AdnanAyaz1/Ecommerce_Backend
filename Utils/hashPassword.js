import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async function (password) {
  return  bcrypt.hash(password, 10);
};

export const comparePassword = async function (password, enteredPassword) {
  const result = await bcrypt.compare(password, enteredPassword);
  return result;
};

export const resetPasswordToken = async () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return hashedToken;
};
