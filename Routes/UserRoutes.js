import { Router } from "express";
import {
  createNewUser,
  verify,
  Login,
  Logout,
  forgotPassword,
  getUser,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  deleteUser,
  resendVerificationOtp,
} from "../Controllers/UserController.js";
import { authenticate, authorize } from "../Middlewares/authMiddleware.js";
const router = Router();
router.route("/new").post(createNewUser);
router.route("/verify").post(verify);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
router.route('/resendOtp').post(resendVerificationOtp)
router.route("/forgotPassword").post(forgotPassword);
router.route("/me").get(authenticate, getUser);
router.route("/password/reset").post(resetPassword);
router.route("/update/password").post(authenticate, updatePassword);
router.route("/update").post(authenticate, updateProfile);
router.route("/allUsers").get(authenticate, authorize("admin"), getAllUsers);
router
  .route("/user/:id")
  .get(authenticate, authorize("admin"), getSingleUser)
  .delete(authenticate, authorize("admin"), deleteUser);

export default router;
