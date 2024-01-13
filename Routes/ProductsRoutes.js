import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  CreateReview,
  deleteAllReviews,
  deleteSingleReview,
  FeaturedProducts,
  SimilarProducts,
} from "../Controllers/ProductsController.js";
import { authenticate, authorize } from "../Middlewares/authMiddleware.js";

const router = Router();
router.route("/new").post(authenticate, authorize("admin"), createProduct);
router.route("/similar/:cat").get(SimilarProducts);
router.route("/featured").get(FeaturedProducts);
router.route("/").get(getAllProducts);
router
  .route("/update/:id")
  .put(authenticate, authorize("admin"), updateProduct);
router
  .route("/delete/:id")
  .delete(authenticate, authorize("admin"), deleteProduct);
router.route("/:id").get(getSingleProduct);
router
  .route("/review/:id")
  .post(authenticate, CreateReview)
  .delete(authenticate, deleteAllReviews);
router.route("/delete/review/:id").delete(deleteSingleReview);
export default router;
