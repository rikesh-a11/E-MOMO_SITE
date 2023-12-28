const Order = require("../../../model/orderSchema");

// get all orders by admin
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate({
    path: "items.product",
    model: "Product",
  });
  if (orders.length == 0) {
    return res.status(400).json({
      message: "No Orders",
      data: [],
    });
  }
  res.status(200).json({
    message: "Orders fetched successfully",
    data: orders,
  });
};


//get single order
exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;
  //check if the order exists or not
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order found with that id",
    });
  }
  res.status(200).json({
    message: "Order fetched successfully",
    data: order,
  });
};


//update status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (
    !orderStatus ||
    !["pending", "delivered", "cancelled", "ontheway", "preparation"].includes(
      orderStatus.toLowerCase()
    )
  ) {
    return res.status(400).json({
      message: "Order status is invalid",
    });
  }
  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order found with that id",
    });
  }
  const updateOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
    },
    { new: true }
  );

  res.status(200).json({
    message: "Order Status updated successfully",
    data: updateOrder,
  });
};


//delete order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    return res.status(400).json({
      message: "No order found with that id",
    });
  }
  await Order.findByIdAndDelete(id);
  res.status(200).json({
    message: "Order deleted successfully",
    data: null,
  });
};
