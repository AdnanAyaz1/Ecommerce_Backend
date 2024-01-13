import { catchAsync } from "../Utils/CatchAsync.js";
import { orderModel } from "../Models/OrdersModel.js";
import { ProductsModel } from "../Models/ProductModel.js";
import AppError from "../Utils/AppError.js";
import ApiFeatures from "../Utils/ApiFeatures.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const { shippingInfo, products, totalAmount, user } = req.body;

  const order = await orderModel.create({
    shippingInfo: shippingInfo,
    productDetails: products,
    totalAmount,
    userDetails: user,
  });

  res.status(201).json({
    msg: "Order Created",
    order,
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const ApiFeature = new ApiFeatures(orderModel.find(), req.query).filter();
  const Allorders = await ApiFeature.query;
  let totalAmount = 0;
  Allorders.forEach((el) => (totalAmount += el.totalAmount));
  res.status(200).json({
    Allorders,
    totalAmount,
  });
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("userDetails", "name email");
  res.status(200).json({
    order,
  });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await orderModel.findByIdAndDelete(req.params.id);
  res.status(200).json({
    msg: "Order Deleted",
    order,
  });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
  const myorders = await orderModel.find({ userDetails: req.user.name });

  res.status(200).json({
    myorders,
  });
});

export const updateOrder = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const order = await orderModel.findByIdAndUpdate(req.params.id, {
    status,
    ShippedAt: Date.now(),
  });

  // At Shipment the qwuantity of porduct needs to be reduced so
  if (status == "delivered") {
    const order = await orderModel.findByIdAndUpdate(req.params.id, {
      status,
      DeliveredAt: Date.now(),
    });

    order.productDetails.forEach(async (pro) => {
      await ProductsModel.findOneAndUpdate(
        { name: pro.name },
        { $inc: { stock: -pro.quantity } },
        { new: true, runValidators: true }
      );
    });
  }

  res.status(200).json({
    msg: "Order Updated",
    order,
  });
});

// export const = catchAsync((req,res,next)=>{

// })
