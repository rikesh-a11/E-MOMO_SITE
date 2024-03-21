const { default: axios } = require("axios");
const { response } = require("express");
const Order = require("../../../model/orderSchema");
const User = require("../../../model/userModel");

//initiate khalti
exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(404).status(400).json({
      message: "Please provide oderId,amount",
    });
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return res.json({
      message: "Order not found with that id",
    });
  }
  //check the coming amount is the totalAmount of order
  if (order.totalAmount !== amount) {
    return res.status(400).json({
      message: "Amount must be equal to totalAmount",
    });
  }
  const data = {
    return_url: "http://localhost:5173/success",
    purchase_order_id: orderId,
    amount: amount * 100,
    website_url: "http://localhost:3000/",
    purchase_order_name: "orderName_" + orderId,
  };

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    data,
    {
      headers: {
        Authorization: "key 503d66b404944ee787dd041aff687c5b",
      },
    }
  );
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();

  res.status(200).json({
    message: "Payment Sucessful",
    paymentUrl: response.data.payment_url,
  });
};

//verifyPidx
exports.verifyPidx = async (req, res) => {
  //   const app = require("./../../../app")
  //   const io = app.getSocketIo()
  const userId = req.user.id;
  const pidx = req.body.pidx;
  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/lookup/",
    { pidx },
    {
      headers: {
        Authorization: "key 503d66b404944ee787dd041aff687c5b",
      },
    }
  );
  if (response.data.status == "Completed") {
    //database ma modification
    let order = await Order.find({ "paymentDetails.pidx": pidx });

    order[0].paymentDetails.method = "Khalti";
    order[0].paymentDetails.status = "paid";
    await order[0].save();

    //empty user cart
    const user = await User.findById(userId);
    user.cart = [];
    await user.save();
    res.status(200).json({
      message: "Payment verified Successfully",
    });
  }
};
