const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");

//creating order
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, items, totalAmount, paymentDetails, phoneNumber } =
    req.body;
  if (
    !shippingAddress ||
    !items.length > 0 ||
    !totalAmount ||
    !paymentDetails ||
    !phoneNumber
  ) {
    return res.status(404).json({
      message:
        "Please Provide ShippingAddress,items,totalAmount,paymentDetails,phoneNumber",
    });
  }

  //insert into orders
  const createdOrder = await Order.create({
    user: userId,
    shippingAddress,
    totalAmount,
    items,
    paymentDetails,
    phoneNumber,
  });

  const user = await User.findById(userId);
  user.cart = [];
  await user.save()
  
  res.status(200).json({
    message: "Order created successfully",
    data: createdOrder,
  });
};

//get my order
exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).populate({
    path: "items.product",
    model: "Product",
    select: "-productStockQty -createAt -updatedAt -reviews -__V",
  });
  if (orders.length == 0) {
    return res.status(404).json({
      message: "No orders",
      data: [],
    });
  }
  res.status(200).json({
    message: "Orders fetched successfully",
    data: orders,
  });
};

//update orders by user
exports.updateMyOrder = async (req, res) => {
  const { id } = req.params;
  const { shippingAddress, items } = req.body;
  if (!shippingAddress || items.length == 0) {
    return res.status(400).json({
      message: "Please Provide shippingAddress,items",
    });
  }
  //get order of above id
  const existingOrder = await Order.findById(id);
  if (!existingOrder) {
    return res.status(404).json({
      message: "No Order with that id",
    });
  }

  //check if the user is validate or not to update
  if (existingOrder.user !== userId) {
    return res.status(403).json({
      message: "You don't have permission to update this order",
    });
  }

  //order on the way aaisakyo vane
  if (existingOrder.orderStatus == "ontheway") {
    return res.status(400).json({
      message: "You cannot update order after ontheway",
    });
  }
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { shippingAddress, items },
    { new: true }
  );
  res.status(200).json({
    message: "Order updated successfully",
    data: updatedOrder,
  });
};

//delete my order
exports.deletMyOrder = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  //check if the order exists or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order with that id",
    });
  }
  if (order.user !== userId) {
    return res.status(400).json({
      message: "You don't have permission to delete this order",
    });
  }
  await Order.findByIdAndDelete(id);
  res.status(200).json({
    message: "Message deleted successfully",
    data: null,
  });
};

//cancel order
exports.cancelOrder = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.id;
  //check if the order exists or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order with that id",
    });
  }
  if (order.user !== userId) {
    return res.status(400).json({
      message: "You don't have permission to delete this order",
    });
  }
  if (order.orderStatus !== "pending") {
    return res.status(400).json({
      message: "You cannot cancel this order as it is not pending",
    });
  }
  const updateOrder = await Order.findByIdAndUpdate(id, {
    orderStatus: "cancelled",
  });
  res.status(200).json({
    message: "Order cacelled successfully",
    data: updateOrder,
  });
};
