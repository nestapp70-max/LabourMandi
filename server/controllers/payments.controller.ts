import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "./models/Payment.js";
import { verifyToken } from "./utils/jwt.js";

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
});

// Create payment order
router.post("/create-order", verifyToken, async (req: any, res) => {
  const { amount } = req.body;
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });
  res.json(order);
});

// Verify payment
router.post("/verify", verifyToken, async (req: any, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign !== razorpay_signature)
    return res.status(400).json({ ok: false });

  await Payment.create({
    user: req.user._id,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    status: "paid"
  });

  res.json({ ok: true });
});

export default router;
