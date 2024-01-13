import { Router } from "express";
const router = Router();
import {
  createOrder,
  getAllOrders,
  getOrder,
  deleteOrder,
  updateOrder,
  getMyOrders,
} from "../Controllers/OrderController.js";
import { authenticate,authorize } from "../Middlewares/authMiddleware.js";
router.route("/new").post(createOrder);
router.route("/").get(getAllOrders);
router
  .route("/:id")
  .get(getOrder)
  .delete(authenticate, authorize("admin"), deleteOrder)
  .put(updateOrder);
router.route("/my/orders").get(authenticate, getMyOrders);
export default router;
