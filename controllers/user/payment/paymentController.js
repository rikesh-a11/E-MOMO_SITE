const { default: axios } = require("axios");
const { response } = require("express");
const Order = require("../../../model/orderSchema");

//initiate khalti
exports.initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({
      message: "Please provide oderId,amount",
    });
  }
  const data = {
    return_url: "http://localhost:3000/api/payment/success",
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
  //   console.log(response.data);
  const order = await Order.findById(orderId);
  order.paymentDetails.pidx = response.data.pidx;
  await order.save();

  res.redirect(response.data.payment_url);
};


//verifyPidx
exports.verifyPidx = async (req, res) => {
//   const app = require("./../../../app")
//   const io = app.getSocketIo()
  const pidx = req.query.pidx;
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

    order[0].paymentDetails.method = "khalti";
    order[0].paymentDetails.status = "paid";
    await order[0].save();
    
    //notify to frontend
    res.redirect("http://localhost:3000");
    // io.emit("payment",{message : "Payment Successfully"})
} else {
    //notify error to frontend
    res.redirect("http://localhost:3000/errorPage");
    // io.emit("payment",{message : "Payment failure"})
  }
};
