import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String,
  paymentId: String,
  status: String
});
export default mongoose.model("Payment", PaymentSchema);
